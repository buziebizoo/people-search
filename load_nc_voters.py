#!/usr/bin/env python3
"""
Load North Carolina voter registration data into Supabase.

Source: https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvoter_Statewide.zip
Format: tab-delimited, header row included, ~8.5M records statewide.

Usage:
    python load_nc_voters.py                          # download and load all records
    python load_nc_voters.py --limit 10000            # load first 10k rows (for testing)
    python load_nc_voters.py --file ncvoter.zip       # use manually downloaded zip
    python load_nc_voters.py --file ncvoter.txt       # use manually extracted txt

Dependencies:
    pip install supabase python-dotenv requests
"""

import argparse
import csv
import os
import sys
import tempfile
import zipfile
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from supabase import create_client

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BATCH_SIZE = 500
NC_DOWNLOAD_URL = "https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvoter_Statewide.zip"


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
# Download / extraction
# ---------------------------------------------------------------------------

def download_zip(tmp_dir: str, session: requests.Session) -> Path:
    print(f"Downloading: {NC_DOWNLOAD_URL}")
    resp = session.get(NC_DOWNLOAD_URL, stream=True, timeout=600)
    resp.raise_for_status()

    total = int(resp.headers.get("content-length", 0))
    zip_path = Path(tmp_dir) / "ncvoter_Statewide.zip"
    downloaded = 0

    with open(zip_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=65536):
            f.write(chunk)
            downloaded += len(chunk)
            if total:
                pct = downloaded / total * 100
                print(f"\r  {downloaded / 1_048_576:.1f} MB / {total / 1_048_576:.1f} MB ({pct:.1f}%)", end="", flush=True)

    print()
    return zip_path


def extract_zip(zip_path: Path, tmp_dir: str) -> Path:
    print(f"Extracting: {zip_path.name}")
    with zipfile.ZipFile(zip_path) as zf:
        txt_names = [n for n in zf.namelist() if n.lower().endswith(".txt")]
        if not txt_names:
            sys.exit(f"ERROR: No .txt file found inside {zip_path.name}")
        extracted = zf.extract(txt_names[0], tmp_dir)
    return Path(extracted)


def resolve_input_file(local_file: Optional[str], tmp_dir: str,
                       session: requests.Session) -> Path:
    if local_file:
        p = Path(local_file)
        if not p.exists():
            sys.exit(f"ERROR: File not found: {local_file}")
        if p.suffix.lower() == ".zip":
            return extract_zip(p, tmp_dir)
        elif p.suffix.lower() == ".txt":
            return p
        else:
            sys.exit(f"ERROR: Unsupported file type '{p.suffix}' — expected .zip or .txt")
    else:
        zip_path = download_zip(tmp_dir, session)
        return extract_zip(zip_path, tmp_dir)


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def build_full_name(first: str, middle: str, last: str, suffix: str) -> str:
    parts = [p.strip() for p in [first, middle, last] if p.strip()]
    name = " ".join(parts)
    if suffix.strip():
        name += f", {suffix.strip()}"
    return name


def parse_row(row: dict) -> Optional[dict]:
    """Map a DictReader row to the Supabase people schema. Returns None to skip."""
    def get(key: str) -> str:
        # Strip BOM, surrounding whitespace, and null bytes that appear in some rows
        val = row.get(key) or ""
        return val.strip().lstrip("﻿").replace("\x00", "")

    first = get("first_name")
    last  = get("last_name")
    if not first and not last:
        return None

    # Field renamed from birth_age to age_at_year_end on 02/09/2022
    age_raw = get("age_at_year_end")
    try:
        age = int(age_raw) if age_raw else None
    except ValueError:
        age = None

    # area_cd no longer exists; full_phone_number contains the full number (e.g. 9195551234)
    phone = get("full_phone_number").replace("-", "").replace(".", "").replace(" ", "")
    phone_prefix = phone[:3] if len(phone) >= 10 else None

    zip_raw = get("zip_code")

    return {
        "first_name":   first or None,
        "last_name":    last or None,
        "full_name":    build_full_name(first, get("middle_name"), last, get("name_suffix_lbl")) or None,
        "age":          age,
        "address":      get("res_street_address") or None,
        "city":         get("res_city_desc") or None,
        "state":        get("state_cd") or "NC",
        "zip":          zip_raw[:10] or None,
        "phone_prefix": phone_prefix,
        "relatives":    None,
    }


# ---------------------------------------------------------------------------
# Supabase insertion
# ---------------------------------------------------------------------------

def insert_batch(batch: list, client, line_num: int):
    try:
        client.table("people").insert(batch).execute()
        return len(batch), 0
    except Exception as e:
        print(f"\n  WARN: batch insert failed near line {line_num}: {e}")
        ok = fail = 0
        for row in batch:
            try:
                client.table("people").insert(row).execute()
                ok += 1
            except Exception:
                fail += 1
        return ok, fail


# ---------------------------------------------------------------------------
# Core loader
# ---------------------------------------------------------------------------

def load_file(txt_path: Path, client, limit: Optional[int]) -> dict:
    stats = {"attempted": 0, "inserted": 0, "failed": 0}
    batch = []

    with open(txt_path, encoding="latin-1", newline="") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for line_num, row in enumerate(reader, start=2):
            record = parse_row(row)
            if record is None:
                continue

            batch.append(record)
            stats["attempted"] += 1

            if len(batch) >= BATCH_SIZE:
                ok, fail = insert_batch(batch, client, line_num)
                stats["inserted"] += ok
                stats["failed"]   += fail
                batch = []

                if stats["attempted"] % 10_000 == 0:
                    print(f"  Progress: {stats['attempted']:,} rows processed, "
                          f"{stats['inserted']:,} inserted, {stats['failed']:,} failed")

            if limit and stats["attempted"] >= limit:
                break

    if batch:
        ok, fail = insert_batch(batch, client, -1)
        stats["inserted"] += ok
        stats["failed"]   += fail

    return stats


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Load NC voter registration data into Supabase")
    parser.add_argument("--file", metavar="PATH",
                        help="Path to a manually downloaded .zip or .txt voter file")
    parser.add_argument("--limit", metavar="N", type=int,
                        help="Stop after loading N records (useful for testing)")
    args = parser.parse_args()

    url, key = load_env()
    client = create_client(url, key)

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; voter-loader/1.0)"})

    with tempfile.TemporaryDirectory() as tmp_dir:
        txt_path = resolve_input_file(args.file, tmp_dir, session)
        print(f"Parsing: {txt_path.name}"
              + (f" (limit: {args.limit:,} rows)" if args.limit else ""))

        stats = load_file(txt_path, client, args.limit)

    print(f"\nDone — attempted: {stats['attempted']:,}, "
          f"inserted: {stats['inserted']:,}, failed: {stats['failed']:,}")


if __name__ == "__main__":
    main()
