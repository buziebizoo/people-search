#!/usr/bin/env python3
"""
Load Florida voter registration data into Supabase.

Usage:
    python load_florida_voters.py --county ALA             # single county (default)
    python load_florida_voters.py --county BAY
    python load_florida_voters.py --all-counties           # all 67 counties
    python load_florida_voters.py --file /path/to/file.zip # manually downloaded file

Dependencies:
    pip install supabase python-dotenv requests
"""

import argparse
import csv
import os
import re
import sys
import tempfile
import zipfile
from datetime import date
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from supabase import create_client

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BATCH_SIZE = 500

# Florida DOS voter extract page — lists available zip downloads
DOS_EXTRACT_PAGE = "https://dos.fl.gov/elections/data-statistics/voter-registration-statistics/voter-extract-request/"

# All 67 Florida county codes used in voter files
ALL_COUNTIES = [
    "ALA", "BAK", "BAY", "BRA", "BRE", "BRO", "CAL", "CHA", "CIT", "CLA",
    "CLM", "COL", "DAD", "SOT", "DES", "DIX", "DUV", "ESC", "FLA", "FRA",
    "GAD", "GIL", "GLA", "GUL", "HAM", "HAR", "HEN", "HER", "HIG", "HIL",
    "HOL", "IND", "JAC", "JEF", "LAF", "LAK", "LEE", "LEO", "LEV", "LIB",
    "MAD", "MAN", "MAR", "MRT", "MON", "NAS", "OKA", "OKE", "ORA", "OSC",
    "PAL", "PAS", "PIN", "POL", "PUT", "SAN", "SAR", "SEM", "STJ", "STL",
    "SUM", "SUW", "TAY", "UNI", "VOL", "WAK", "WAL", "WAS",
]

# ---------------------------------------------------------------------------
# Field positions in the pipe-delimited voter file (0-based column index)
# Source: Florida DOS Voter Registration File Layout spec
# ---------------------------------------------------------------------------
COL_COUNTY          = 0
COL_VOTER_ID        = 1
COL_NAME_SUFFIX     = 2
COL_LAST_NAME       = 3
COL_FIRST_NAME      = 4
COL_MIDDLE_NAME     = 5
COL_ADDRESS_1       = 7
COL_ADDRESS_2       = 8
COL_CITY            = 9
COL_STATE           = 10
COL_ZIP             = 11
COL_BIRTH_DATE      = 19
COL_AREA_CODE       = 32


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_env():
    env_path = Path(__file__).parent / ".env.local"
    load_dotenv(dotenv_path=env_path)
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        sys.exit("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
    return url, key


def find_county_urls(session: requests.Session) -> dict:
    """
    Scrape the DOS voter extract page and return a dict of {COUNTY_CODE: url}.
    Looks for links to zip files whose names contain a county code pattern.
    """
    print(f"  Fetching download page: {DOS_EXTRACT_PAGE}")
    resp = session.get(DOS_EXTRACT_PAGE, timeout=30)
    resp.raise_for_status()

    urls = {}
    # Match any href pointing to a .zip file; capture the county code from the filename
    for href in re.findall(r'href=["\']([^"\']+\.zip)["\']', resp.text, re.IGNORECASE):
        # Resolve relative URLs
        if href.startswith("http"):
            full_url = href
        elif href.startswith("/"):
            base = re.match(r'(https?://[^/]+)', DOS_EXTRACT_PAGE).group(1)
            full_url = base + href
        else:
            full_url = DOS_EXTRACT_PAGE.rstrip("/") + "/" + href

        # Extract county code: expect something like ALA_20251001.zip or ALA.zip
        filename = full_url.split("/")[-1]
        m = re.match(r'([A-Z]{2,4})[\._]', filename, re.IGNORECASE)
        if m:
            code = m.group(1).upper()
            # Keep the latest file if there are multiple for the same county
            if code not in urls or filename > urls[code].split("/")[-1]:
                urls[code] = full_url

    return urls


def extract_zip(zip_path: Path, tmp_dir: str) -> Path:
    """Extract the first .txt file from a zip and return its path."""
    with zipfile.ZipFile(zip_path) as zf:
        txt_names = [n for n in zf.namelist() if n.lower().endswith(".txt")]
        if not txt_names:
            raise ValueError(f"No .txt file found inside {zip_path.name}")
        extracted = zf.extract(txt_names[0], tmp_dir)
    return Path(extracted)


def download_and_extract(county: str, session: requests.Session, tmp_dir: str) -> Path:
    """Download the zip for a county from the DOS page and return the extracted .txt path."""
    county_urls = find_county_urls(session)

    if county not in county_urls:
        available = ", ".join(sorted(county_urls.keys())) or "none found"
        raise ValueError(
            f"County '{county}' not found on the DOS download page.\n"
            f"Available counties: {available}\n"
            f"Tip: use --file /path/to/downloaded.zip to load a manually downloaded file."
        )

    url = county_urls[county]
    print(f"  Downloading: {url}")
    resp = session.get(url, stream=True, timeout=300)
    resp.raise_for_status()

    zip_path = Path(tmp_dir) / f"{county}.zip"
    with open(zip_path, "wb") as f:
        for chunk in resp.iter_content(chunk_size=65536):
            f.write(chunk)

    return extract_zip(zip_path, tmp_dir)


def extract_from_local_file(file_path: str, tmp_dir: str) -> Path:
    """Use a manually downloaded file (zip or txt) directly."""
    p = Path(file_path)
    if not p.exists():
        sys.exit(f"ERROR: File not found: {file_path}")
    if p.suffix.lower() == ".zip":
        print(f"  Extracting: {p.name}")
        return extract_zip(p, tmp_dir)
    elif p.suffix.lower() == ".txt":
        return p
    else:
        sys.exit(f"ERROR: Unsupported file type '{p.suffix}' — expected .zip or .txt")


def parse_birth_date(raw: str) -> Optional[int]:
    """Return age in years from MM/DD/YYYY string, or None if unparseable."""
    raw = raw.strip()
    if not raw:
        return None
    try:
        parts = raw.split("/")
        birth_year = int(parts[2])
        current_year = date.today().year
        age = current_year - birth_year
        return age if 0 < age < 130 else None
    except (IndexError, ValueError):
        return None


def build_full_name(first: str, middle: str, last: str, suffix: str) -> str:
    parts = [p.strip() for p in [first, middle, last] if p.strip()]
    name = " ".join(parts)
    if suffix.strip():
        name += f", {suffix.strip()}"
    return name


def parse_row(cols: list) -> Optional[dict]:
    """Map a parsed row to the Supabase people table schema. Returns None to skip."""
    def get(idx: int) -> str:
        return cols[idx].strip() if idx < len(cols) else ""

    first = get(COL_FIRST_NAME)
    last  = get(COL_LAST_NAME)
    if not first and not last:
        return None

    addr1 = get(COL_ADDRESS_1)
    addr2 = get(COL_ADDRESS_2)
    address = f"{addr1} {addr2}".strip() if addr2 else addr1

    return {
        "first_name":   first,
        "last_name":    last,
        "full_name":    build_full_name(first, get(COL_MIDDLE_NAME), last, get(COL_NAME_SUFFIX)),
        "age":          parse_birth_date(get(COL_BIRTH_DATE)),
        "address":      address or None,
        "city":         get(COL_CITY) or None,
        "state":        get(COL_STATE) or "FL",
        "zip":          get(COL_ZIP)[:10] or None,
        "phone_prefix": get(COL_AREA_CODE) or None,
        "relatives":    None,
    }


# ---------------------------------------------------------------------------
# Core loader
# ---------------------------------------------------------------------------

def load_county(county: str, supabase_client, session: requests.Session,
                local_file: Optional[str] = None) -> dict:
    print(f"\n{'='*60}")
    print(f"County: {county}" if not local_file else f"File: {local_file}")

    stats = {"attempted": 0, "inserted": 0, "failed": 0}

    with tempfile.TemporaryDirectory() as tmp_dir:
        if local_file:
            txt_path = extract_from_local_file(local_file, tmp_dir)
        else:
            txt_path = download_and_extract(county, session, tmp_dir)
        print(f"  Extracted: {txt_path.name}")

        batch = []
        failed_rows = []

        with open(txt_path, encoding="latin-1", newline="") as f:
            reader = csv.reader(f, delimiter="|")
            for line_num, cols in enumerate(reader, start=1):
                record = parse_row(cols)
                if record is None:
                    continue

                batch.append(record)
                stats["attempted"] += 1

                if len(batch) >= BATCH_SIZE:
                    ok, fail = insert_batch(batch, supabase_client, line_num)
                    stats["inserted"] += ok
                    stats["failed"]   += fail
                    batch = []

                    if stats["attempted"] % 10_000 == 0:
                        print(f"  Progress: {stats['attempted']:,} rows processed, "
                              f"{stats['inserted']:,} inserted, {stats['failed']:,} failed")

        # flush remaining
        if batch:
            ok, fail = insert_batch(batch, supabase_client, -1)
            stats["inserted"] += ok
            stats["failed"]   += fail

    print(f"  Done — attempted: {stats['attempted']:,}, "
          f"inserted: {stats['inserted']:,}, failed: {stats['failed']:,}")
    return stats


def insert_batch(batch, client, line_num: int):
    try:
        client.table("people").insert(batch).execute()
        return len(batch), 0
    except Exception as e:
        print(f"  WARN: batch insert failed near line {line_num}: {e}")
        # Try row-by-row to isolate bad records
        ok = fail = 0
        for row in batch:
            try:
                client.table("people").insert(row).execute()
                ok += 1
            except Exception:
                fail += 1
        return ok, fail


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Load Florida voter data into Supabase")
    source_group = parser.add_mutually_exclusive_group()
    source_group.add_argument("--county", default="ALA", metavar="CODE",
                              help="Single county code to download and load (default: ALA)")
    source_group.add_argument("--all-counties", action="store_true",
                              help="Download and load all 67 Florida counties")
    source_group.add_argument("--file", metavar="PATH",
                              help="Path to a manually downloaded .zip or .txt voter file")
    args = parser.parse_args()

    url, key = load_env()
    client = create_client(url, key)

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0 (compatible; voter-loader/1.0)"})

    totals = {"attempted": 0, "inserted": 0, "failed": 0}

    if args.file:
        # Single manually supplied file — county label is just for display
        county_label = Path(args.file).stem.split("_")[0].upper()
        try:
            stats = load_county(county_label, client, session, local_file=args.file)
            totals = stats
        except Exception as e:
            sys.exit(f"ERROR: {e}")
    else:
        counties = ALL_COUNTIES if args.all_counties else [args.county.upper()]
        for county in counties:
            try:
                stats = load_county(county, client, session)
                for k in totals:
                    totals[k] += stats[k]
            except Exception as e:
                print(f"  ERROR loading {county}: {e}")

        if len(counties) > 1:
            print(f"\n{'='*60}")
            print(f"TOTAL — attempted: {totals['attempted']:,}, "
                  f"inserted: {totals['inserted']:,}, failed: {totals['failed']:,}")


if __name__ == "__main__":
    main()
