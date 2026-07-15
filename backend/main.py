from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Load environment variables FIRST before any other imports
load_dotenv()

from database import engine, get_db, Base
from models import Member, MembershipCreate, MembershipResponse, SuccessResponse
from routers.rag import router as rag_router
from routers.chatbot import router as chatbot_router
from routers.chatkit import router as chatkit_router
from routers.voice import router as voice_router
from routers.ai_chat import router as ai_chat_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tanzeem-e-Khawajgan API",
    description="API for membership, banquet booking, and RAG services",
    version="1.0.0"
)

# CORS configuration - MUST be before routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://tanzeem-e-khawajgan.vercel.app",
        "*",  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - AFTER middleware
app.include_router(rag_router)
app.include_router(chatbot_router)
app.include_router(chatkit_router)
app.include_router(voice_router)
app.include_router(ai_chat_router)


@app.get("/")
def root():
    return {"message": "Tanzeem-e-Khawajgan Membership API", "status": "running"}


@app.post("/submit-membership", response_model=SuccessResponse)
def submit_membership(membership: MembershipCreate, db: Session = Depends(get_db)):
    try:
        db_member = Member(
            membership_no=None,  # assigned only after admin approval
            gender=membership.gender.value,
            full_name=membership.full_name,
            relationship_type=membership.relationship_type.value,
            relation_name=membership.relation_name,
            father_in_law_name=membership.father_in_law_name,
            cnic=membership.cnic,
            country=membership.country,
            native_city=membership.native_city,
            current_city=membership.current_city,
            city=membership.city,  # Legacy field
            address=membership.address,
            date_of_birth=membership.date_of_birth,
            cast=membership.cast,
            source_of_income=membership.source_of_income,
            education=membership.education,
            occupation=membership.occupation,
            profession=membership.profession,
            dependents_count=membership.dependents_count,
            dependents_relation=membership.dependents_relation,
            form_received_date=membership.form_received_date,
            verified_by=membership.verified_by,
            verification_remarks=membership.verification_remarks,
            approval_status=membership.approval_status.value if membership.approval_status else "pending",
            membership_issued_date=membership.membership_issued_date,
            official_signature=membership.official_signature,
            office_stamp=membership.office_stamp,
        )

        db.add(db_member)
        db.commit()
        db.refresh(db_member)

        return SuccessResponse(
            success=True,
            message="Membership application submitted successfully",
            data=MembershipResponse(
                id=db_member.id,
                membership_no=db_member.membership_no,
                full_name=db_member.full_name,
                cnic=db_member.cnic,
                approval_status=db_member.approval_status,
                created_at=db_member.created_at,
            )
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/approve-member/{member_id}")
def approve_member(member_id: int, db: Session = Depends(get_db)):
    """
    Approve a membership application and auto-assign a membership number.
    Membership number format: TK-XXXXX (sequential)
    """
    from sqlalchemy import text
    from datetime import date

    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    if member.approval_status == "approved":
        raise HTTPException(status_code=400, detail="Member is already approved")

    # Generate next membership number
    result = db.execute(text(
        "SELECT membership_no FROM members WHERE membership_no LIKE 'TK-%' ORDER BY id DESC LIMIT 1"
    ))
    last = result.fetchone()
    if last and last.membership_no:
        try:
            last_num = int(last.membership_no.replace("TK-", ""))
            next_num = last_num + 1
        except ValueError:
            next_num = 1
    else:
        next_num = 1

    membership_no = f"TK-{str(next_num).zfill(5)}"

    member.membership_no = membership_no
    member.approval_status = "approved"
    member.membership_issued_date = date.today()

    db.commit()
    db.refresh(member)

    return {
        "success": True,
        "message": f"Member approved. Membership number: {membership_no}",
        "data": {
            "id": member.id,
            "membership_no": member.membership_no,
            "full_name": member.full_name,
            "approval_status": member.approval_status,
            "membership_issued_date": str(member.membership_issued_date),
        }
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/context/live")
def get_live_context(db: Session = Depends(get_db)):
    """Returns live data for the AI chatbot: banquet booked dates for next 90 days."""
    from datetime import date, timedelta
    from sqlalchemy import text

    today = date.today()
    cutoff = today + timedelta(days=90)
    try:
        result = db.execute(text("""
            SELECT b.booking_date, bh.name AS hall_name, b.status
            FROM bookings b
            JOIN banquet_halls bh ON b.hall_id = bh.id
            WHERE b.booking_date >= :today AND b.booking_date <= :cutoff
              AND b.status IN ('confirmed', 'pending')
            ORDER BY b.booking_date
        """), {"today": today, "cutoff": cutoff})
        rows = result.fetchall()
        booked: dict = {}
        for row in rows:
            ds = str(row.booking_date)
            booked.setdefault(ds, []).append({"hall": row.hall_name, "status": row.status})
        return {"success": True, "banquet_booked_dates": booked, "as_of": str(today)}
    except Exception as e:
        return {"success": False, "banquet_booked_dates": {}, "error": str(e)}


@app.get("/lookup-member")
def lookup_member(
    membership_no: str = None,
    full_name: str = None,
    cnic: str = None,
    db: Session = Depends(get_db)
):
    """
    Look up a member by CNIC, membership number, or full name.
    Searches both 'members' and 'membership_info' tables.
    """
    from sqlalchemy import text

    if not membership_no and not full_name and not cnic:
        raise HTTPException(status_code=400, detail="Please provide cnic, membership_no, or full_name")

    # Helper function to format member data from membership_info table
    def format_membership_info(row):
        return {
            "membership_no": row.membership_no,
            "full_name": row.name,
            "gender": row.gender,
            "relation_name": row.husband_father_name,
            "father_in_law_name": row.grand_father_father_in_law_name,
            "cnic": row.cnic,
            "native_city": row.native_city,
            "date_of_birth": str(row.dob) if row.dob else None,
            "cast": row.cast,
            "source_of_income": row.source_of_income,
            "address": row.home_address,
            "contact_no": row.contact_no,
            "email": row.email_address
        }

    def format_member(m: Member):
        return {
            "membership_no": m.membership_no if m.approval_status == "approved" else None,
            "full_name": m.full_name,
            "relation_name": m.relation_name,
            "cnic": m.cnic,
            "native_city": m.native_city,
            "phone": m.phone,
            "blood_group": m.blood_group,
            "occupation": m.occupation,
            "address": m.address,
            "category": m.category,
            "cast": m.cast,
            "dependents_count": m.dependents_count,
            "approval_status": m.approval_status,
            "qr_url": m.qr_url,
            "date_of_birth": str(m.date_of_birth) if m.date_of_birth else None,
        }

    db_errors = []

    # Search in members table first (newly imported data)
    try:
        if cnic:
            clean_cnic = cnic.replace("-", "").replace(" ", "").strip()
            m = db.query(Member).filter(Member.cnic.ilike(f"%{clean_cnic}%")).first()
            if m:
                return {"success": True, "message": "Member found", "data": format_member(m)}

        if membership_no:
            mn_variants = [membership_no, membership_no.upper(), membership_no.replace(" ", "-"), membership_no.replace("-", " ")]
            for v in mn_variants:
                m = db.query(Member).filter(Member.membership_no == v).first()
                if m:
                    return {"success": True, "message": "Member found", "data": format_member(m)}

        if full_name:
            results = db.query(Member).filter(Member.full_name.ilike(f"%{full_name}%")).limit(10).all()
            if len(results) == 1:
                return {"success": True, "message": "Member found", "data": format_member(results[0])}
            elif len(results) > 1:
                return {
                    "success": True,
                    "message": f"Multiple members found ({len(results)})",
                    "multiple": True,
                    "data": [{"membership_no": r.membership_no, "full_name": r.full_name, "cnic": r.cnic} for r in results]
                }
    except Exception as e:
        print(f"[ERROR] members table lookup: {e}")
        db_errors.append(f"members table: {e}")
        db.rollback()

    # Search in membership_info table (has 598 records)
    try:
        # Search by CNIC
        if cnic:
            clean_cnic = cnic.replace("-", "").replace(" ", "").strip()
            result = db.execute(text(
                "SELECT * FROM membership_info WHERE REPLACE(REPLACE(cnic, '-', ''), ' ', '') LIKE :cnic LIMIT 1"
            ), {"cnic": f"%{clean_cnic}%"})
            row = result.fetchone()
            if row:
                return {
                    "success": True,
                    "message": "Member found by CNIC",
                    "data": format_membership_info(row)
                }

        # Search by membership number
        if membership_no:
            result = db.execute(text(
                "SELECT * FROM membership_info WHERE membership_no LIKE :membership_no LIMIT 1"
            ), {"membership_no": f"%{membership_no}%"})
            row = result.fetchone()
            if row:
                return {
                    "success": True,
                    "message": "Member found by membership number",
                    "data": format_membership_info(row)
                }

        # Search by name
        if full_name:
            result = db.execute(text(
                "SELECT * FROM membership_info WHERE name LIKE :name LIMIT 10"
            ), {"name": f"%{full_name}%"})
            rows = result.fetchall()
            if rows:
                if len(rows) == 1:
                    return {
                        "success": True,
                        "message": "Member found by name",
                        "data": format_membership_info(rows[0])
                    }
                else:
                    return {
                        "success": True,
                        "message": f"Multiple members found ({len(rows)})",
                        "multiple": True,
                        "data": [
                            {
                                "membership_no": r.membership_no,
                                "full_name": r.name,
                                "cnic": r.cnic
                            }
                            for r in rows
                        ]
                    }

    except Exception as e:
        print(f"[ERROR] membership_info table lookup: {e}")
        # If membership_info table doesn't exist, treat as no results (not a fatal error)
        err_str = str(e)
        if "UndefinedTable" not in err_str and "does not exist" not in err_str:
            db_errors.append(f"membership_info table: {e}")

    # Only raise 500 for unexpected errors, not missing legacy table
    if db_errors:
        raise HTTPException(status_code=500, detail=f"Database error: {'; '.join(db_errors)}")

    return {
        "success": False,
        "message": "Member not found. Please check your CNIC, Membership Number or Name."
    }
