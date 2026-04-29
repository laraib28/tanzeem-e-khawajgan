"""
Google Sheets se Members import script.

Steps:
  1. Sheet 1 (Members data) → File → Download → CSV → naam rakhein: members_data.csv
  2. Sheet 2 (QR codes)     → File → Download → CSV → naam rakhein: members_qr.csv
  3. Dono files backend/ folder mein rakhein
  4. Run: python import_members_csv.py

Sheet 1 columns: Membership #, Name, Father's Name, Category, CNIC, Cast,
                 Native City, Blood Group, Cell No, Work, Address, Dependent, Status

Sheet 2 columns: S. No, M/Ship, M/Ship lowercase, URL, Complete URL for QR,
                 QR Code (Formula), QR Code (Download URL)
"""

import csv
import os
import sys

from dotenv import load_dotenv
from sqlalchemy.orm import Session

load_dotenv()

sys.path.insert(0, os.path.dirname(__file__))
from database import SessionLocal, engine
from models import Base, Member

SHEET1_CSV = os.path.join(os.path.dirname(__file__), "members-data.csv")
SHEET2_CSV = os.path.join(os.path.dirname(__file__), "members_q.r.csv")


def clean(val) -> str:
    return str(val).strip() if val else ""


def parse_int(val) -> int:
    try:
        return int(clean(val))
    except (ValueError, TypeError):
        return 0


# ─────────────────────────────────────────────
# STEP 1: Sheet 1 → Members table mein insert
# ─────────────────────────────────────────────
def import_sheet1(db: Session):
    if not os.path.exists(SHEET1_CSV):
        print(f"[ERROR] File nahi mili: {SHEET1_CSV}")
        sys.exit(1)

    inserted = 0
    updated = 0
    errors = 0

    with open(SHEET1_CSV, newline="", encoding="utf-8-sig") as f:
        raw = list(csv.reader(f))

    # Pehli row title ho sakti hai — actual headers woh row hain jisme "Membership" ho
    header_idx = 0
    for idx, row in enumerate(raw):
        if any("membership" in str(c).lower() for c in row):
            header_idx = idx
            break

    headers = [c.strip() for c in raw[header_idx]]
    data_rows = raw[header_idx + 1:]
    print(f"\n[Sheet 1] Headers (row {header_idx+1}): {headers}\n")

    for i, raw_row in enumerate(data_rows, start=header_idx + 2):
        row = dict(zip(headers, raw_row))
        try:
            membership_no = clean(row.get("Membership #") or row.get("Membership#") or "")
            full_name = clean(row.get("Name") or "")

            if not full_name and not membership_no:
                continue

            cnic = clean(row.get("CNIC") or "").replace("-", "").replace(" ", "")

            existing = None
            if membership_no:
                existing = db.query(Member).filter(Member.membership_no == membership_no).first()
            if not existing and cnic:
                existing = db.query(Member).filter(Member.cnic == cnic).first()

            status_raw = clean(row.get("Status") or "pending").lower()
            approval_status = status_raw if status_raw in ("pending", "approved", "rejected") else "approved"

            data = dict(
                membership_no=membership_no or None,
                full_name=full_name or "Unknown",
                relation_name=clean(row.get("Father's Name") or row.get("Fathers Name") or ""),
                relationship_type="son_of",
                cnic=cnic or None,
                category=clean(row.get("Category") or ""),
                cast=clean(row.get("Cast") or row.get("Caste") or ""),
                native_city=clean(row.get("Native City") or ""),
                blood_group=clean(row.get("Blood Group") or "") or None,
                phone=clean(row.get("Cell No") or row.get("Phone") or "") or None,
                occupation=clean(row.get("Work") or ""),
                source_of_income=clean(row.get("Work") or row.get("Category") or ""),
                address=clean(row.get("Address") or ""),
                dependents_count=parse_int(row.get("Dependent") or 0),
                approval_status=approval_status,
                country="Pakistan",
            )

            if existing:
                for key, val in data.items():
                    setattr(existing, key, val)
                updated += 1
            else:
                db.add(Member(**data))
                inserted += 1

            if (inserted + updated) % 50 == 0:
                db.commit()
                print(f"  → {inserted} inserted, {updated} updated so far...")

        except Exception as e:
            print(f"[ERROR] Row {i} ({row.get('Name', '')}): {e}")
            errors += 1
            db.rollback()

    db.commit()
    print(f"\n✅ Sheet 1 done → Inserted: {inserted} | Updated: {updated} | Errors: {errors}")


# ─────────────────────────────────────────────
# STEP 2: Sheet 2 → QR URL members ke saath update
# ─────────────────────────────────────────────
def import_sheet2_qr(db: Session):
    if not os.path.exists(SHEET2_CSV):
        print(f"\n[WARNING] QR CSV nahi mili: {SHEET2_CSV} — QR step skip")
        return

    matched = 0
    no_match = 0
    errors = 0

    with open(SHEET2_CSV, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        print(f"\n[Sheet 2] Columns: {reader.fieldnames}\n")

        for i, row in enumerate(reader, start=2):
            try:
                membership_no = clean(
                    row.get("M/Ship") or row.get("M/Ship lowercase") or row.get("S. No") or ""
                )
                qr_url = clean(
                    row.get("Complete URL for QR") or
                    row.get("QR Code (Download URL)") or
                    row.get("URL") or ""
                )

                if not membership_no:
                    continue

                # Membership number normalize karo (KA 001 → KA-001 bhi try karo)
                mn_variants = list({
                    membership_no,
                    membership_no.upper(),
                    membership_no.lower(),
                    membership_no.replace(" ", "-"),
                    membership_no.replace("-", " "),
                    membership_no.upper().replace(" ", "-"),
                    membership_no.upper().replace("-", " "),
                })

                member = None
                for variant in mn_variants:
                    member = db.query(Member).filter(Member.membership_no == variant).first()
                    if member:
                        break

                if member:
                    member.qr_url = qr_url or None
                    matched += 1
                else:
                    # Member exist nahi karta — naya record banao sirf QR ke saath
                    db.add(Member(
                        membership_no=membership_no,
                        full_name=f"Member-{membership_no}",
                        qr_url=qr_url or None,
                        approval_status="pending",
                        country="Pakistan",
                        cast="",
                        source_of_income="",
                        education="",
                        occupation="",
                    ))
                    no_match += 1

                if (matched + no_match) % 50 == 0:
                    db.commit()

            except Exception as e:
                print(f"[ERROR] QR Row {i}: {e}")
                errors += 1
                db.rollback()

    db.commit()
    print(f"✅ Sheet 2 done → QR Updated: {matched} | New records: {no_match} | Errors: {errors}")


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    print("=" * 55)
    print("  Tanzeem-e-Khawajgan — Members CSV Import")
    print("=" * 55)

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        import_sheet1(db)
        import_sheet2_qr(db)
        print("\n🎉 Import mukammal hua!")
    except Exception as e:
        print(f"\n[FATAL ERROR] {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
