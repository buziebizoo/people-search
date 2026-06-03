#!/usr/bin/env python3
"""
Load Ohio voter registration data into Supabase.

Source: Ohio Secretary of State voter file portal (manual download required)
        https://www6.ohiosos.gov/ords/f?p=VOTERFTP:STWD
Format: comma-delimited, header row included.

Before running, create the unique index in Supabase SQL editor to enable
duplicate skipping:

    CREATE UNIQUE INDEX IF NOT EXISTS people_name_zip_uniq
      ON public.people (first_name, last_name, zip);

Usage:
    python load_ohio_voters.py --file ~/Downloads/SWVF_1_22.txt
    python load_ohio_voters.py --file ~/Downloads/SWVF_1_22.txt --limit 1000
    python load_ohio_voters.py --dir ~/Downloads
    python load_ohio_voters.py --dir ~/Downloads --limit 5000

Dependencies:
    pip install supabase python-dotenv
"""

import argparse
import csv
import os
import re
import sys
from datetime import date
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BATCH_SIZE = 200


# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

def load_env():
    env_path = Path(__file__).parent / ".env.local"
    load_dotenv(dotenv_path=env_path)
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
    return url, key


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def build_full_name(first: str, middle: str, last: str, suffix: str) -> str:
    parts = [p.strip() for p in [first, middle, last] if p.strip()]
    name = " ".join(parts)
    if suffix.strip():
        name += f", {suffix.strip()}"
    return name


def parse_dob_age(raw: str) -> Optional[int]:
    """Return age in years from MM/DD/YYYY, or None if unparseable."""
    raw = raw.strip()
    if not raw:
        return None
    try:
        parts = raw.split("/")
        birth_year = int(parts[2])
        age = date.today().year - birth_year
        return age if 0 < age < 130 else None
    except (IndexError, ValueError):
        return None


def parse_row(row: dict) -> Optional[dict]:
    """Map an Ohio DictReader row to the Supabase people schema. Returns None to skip."""
    def get(key: str) -> str:
        val = row.get(key) or ""
        return val.strip().lstrip("﻿").replace("\x00", "")

    first = get("FIRST_NAME")
    last  = get("LAST_NAME")
    if not first and not last:
        return None

    phone = re.sub(r"\D", "", get("PHONE"))
    phone = phone if len(phone) >= 10 else None

    zip_raw = get("RESIDENTIAL_ZIP")

    return {
        "first_name":   first or None,
        "last_name":    last or None,
        "full_name":    build_full_name(first, get("MIDDLE_NAME"), last, get("SUFFIX")) or None,
        "age":          parse_dob_age(get("DATE_OF_BIRTH")),
        "address":      get("RESIDENTIAL_ADDRESS1") or None,
        "city":         get("RESIDENTIAL_CITY") or None,
        "state":        get("RESIDENTIAL_STATE") or "OH",
        "zip":          zip_raw[:10] or None,
        "phone": phone,
        "relatives":    None,
    }


# ---------------------------------------------------------------------------
# Supabase insertion
# ---------------------------------------------------------------------------

def upsert_batch(batch: list, client, line_num: int) -> tuple:
    try:
        client.table("people").insert(batch).execute()
        return len(batch), 0, 0
    except Exception as e:
        print(f"\n  WARN: batch insert failed near line {line_num}: {e}", flush=True)
        inserted = failed = 0
        for row in batch:
            try:
                client.table("people").insert(row).execute()
                inserted += 1
            except Exception:
                failed += 1
        return inserted, 0, failed


# ---------------------------------------------------------------------------
# Core loader
# ---------------------------------------------------------------------------

def load_txt_file(txt_path: Path, client, limit: Optional[int],
                  running_total: int, index: int, total_files: int) -> dict:
    print(f"\n[{index}/{total_files}] {txt_path.name}")
    stats = {"attempted": 0, "inserted": 0, "skipped": 0, "failed": 0}
    batch = []

    with open(txt_path, encoding="latin-1", newline="") as f:
        reader = csv.DictReader(f, delimiter=",")
        for line_num, row in enumerate(reader, start=2):
            record = parse_row(row)
            if record is None:
                continue

            batch.append(record)
            stats["attempted"] += 1

            if len(batch) >= BATCH_SIZE:
                ins, skip, fail = upsert_batch(batch, client, line_num)
                stats["inserted"] += ins
                stats["skipped"]  += skip
                stats["failed"]   += fail
                batch = []

                total_so_far = running_total + stats["attempted"]
                if total_so_far % 10_000 < BATCH_SIZE:
                    print(
                        f"  Progress: {stats['attempted']:,} rows in this file "
                        f"({total_so_far:,} total) — "
                        f"inserted {stats['inserted']:,}, "
                        f"skipped {stats['skipped']:,}, "
                        f"failed {stats['failed']:,}"
                    )

            if limit and (running_total + stats["attempted"]) >= limit:
                break

    if batch:
        ins, skip, fail = upsert_batch(batch, client, -1)
        stats["inserted"] += ins
        stats["skipped"]  += skip
        stats["failed"]   += fail

    print(
        f"  Done — attempted: {stats['attempted']:,}, "
        f"inserted: {stats['inserted']:,}, "
        f"skipped: {stats['skipped']:,}, "
        f"failed: {stats['failed']:,}"
    )
    return stats


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Load Ohio voter data into Supabase")
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--file", metavar="PATH",
                        help="Single .txt voter file to load")
    source.add_argument("--dir", metavar="PATH",
                        help="Directory of .txt voter files to load in order")
    parser.add_argument("--limit", metavar="N", type=int,
                        help="Stop after N total records (for testing)")
    args = parser.parse_args()

    url, key = load_env()
    client = create_client(url, key)

    if args.file:
        p = Path(args.file).expanduser()
        if not p.exists():
            sys.exit(f"ERROR: File not found: {args.file}")
        if p.suffix.lower() != ".txt":
            sys.exit(f"ERROR: Expected a .txt file, got '{p.suffix}'")
        txt_files = [p]
    else:
        d = Path(args.dir).expanduser()
        if not d.is_dir():
            sys.exit(f"ERROR: Not a directory: {args.dir}")
        txt_files = sorted(d.glob("*.txt"))
        if not txt_files:
            sys.exit(f"ERROR: No .txt files found in {args.dir}")

    sys.stdout.reconfigure(line_buffering=True)

    print(f"Found {len(txt_files)} file(s) to process"
          + (f" — limit: {args.limit:,} total rows" if args.limit else ""))
    for f in txt_files:
        print(f"  {f.name}")

    totals = {"attempted": 0, "inserted": 0, "skipped": 0, "failed": 0}

    for i, txt_path in enumerate(txt_files, start=1):
        if args.limit and totals["attempted"] >= args.limit:
            print("\nLimit reached — stopping.")
            break

        file_stats = load_txt_file(
            txt_path, client, args.limit,
            running_total=totals["attempted"],
            index=i,
            total_files=len(txt_files),
        )
        for k in totals:
            totals[k] += file_stats[k]

    print(f"\n{'='*60}")
    print(
        f"TOTAL — attempted: {totals['attempted']:,}, "
        f"inserted: {totals['inserted']:,}, "
        f"skipped (duplicates): {totals['skipped']:,}, "
        f"failed: {totals['failed']:,}"
    )


if __name__ == "__main__":
    main()
