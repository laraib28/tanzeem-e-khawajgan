from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Member, MembershipCreate, MembershipResponse, SuccessResponse
from routers.rag import router as rag_router
from routers.chatbot import router as chatbot_router
from routers.chatkit import router as chatkit_router

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


@app.get("/")
def root():
    return {"message": "Tanzeem-e-Khawajgan Membership API", "status": "running"}


@app.post("/submit-membership", response_model=SuccessResponse)
def submit_membership(membership: MembershipCreate, db: Session = Depends(get_db)):
    try:
        db_member = Member(
            membership_no=membership.membership_no,
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


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/lookup-member")
def lookup_member(
    membership_no: str = None,
    full_name: str = None,
    db: Session = Depends(get_db)
):
    """
    Look up a member by membership number or full name.
    Returns member data if found, or error message if not found.
    """
    if not membership_no and not full_name:
        raise HTTPException(status_code=400, detail="Please provide membership_no or full_name")

    query = db.query(Member)

    if membership_no:
        # Search by membership number (case-insensitive)
        member = query.filter(Member.membership_no.ilike(membership_no)).first()
        if member:
            return {
                "success": True,
                "message": "Member found",
                "data": {
                    "id": member.id,
                    "membership_no": member.membership_no,
                    "gender": member.gender,
                    "full_name": member.full_name,
                    "relationship_type": member.relationship_type,
                    "relation_name": member.relation_name,
                    "father_in_law_name": member.father_in_law_name,
                    "cnic": member.cnic,
                    "country": member.country,
                    "native_city": member.native_city,
                    "current_city": member.current_city,
                    "city": member.city,
                    "address": member.address,
                    "date_of_birth": str(member.date_of_birth) if member.date_of_birth else None,
                    "cast": member.cast,
                    "source_of_income": member.source_of_income,
                    "education": member.education,
                    "occupation": member.occupation,
                    "profession": member.profession,
                    "dependents_count": member.dependents_count,
                    "dependents_relation": member.dependents_relation,
                    "approval_status": member.approval_status
                }
            }

    if full_name:
        # Search by full name (case-insensitive, partial match)
        members = query.filter(Member.full_name.ilike(f"%{full_name}%")).all()
        if members:
            if len(members) == 1:
                member = members[0]
                return {
                    "success": True,
                    "message": "Member found",
                    "data": {
                        "id": member.id,
                        "membership_no": member.membership_no,
                        "gender": member.gender,
                        "full_name": member.full_name,
                        "relationship_type": member.relationship_type,
                        "relation_name": member.relation_name,
                        "father_in_law_name": member.father_in_law_name,
                        "cnic": member.cnic,
                        "country": member.country,
                        "native_city": member.native_city,
                        "current_city": member.current_city,
                        "city": member.city,
                        "address": member.address,
                        "date_of_birth": str(member.date_of_birth) if member.date_of_birth else None,
                        "cast": member.cast,
                        "source_of_income": member.source_of_income,
                        "education": member.education,
                        "occupation": member.occupation,
                        "profession": member.profession,
                        "dependents_count": member.dependents_count,
                        "dependents_relation": member.dependents_relation,
                        "approval_status": member.approval_status
                    }
                }
            else:
                # Multiple matches - return list of names for user to select
                return {
                    "success": True,
                    "message": f"Multiple members found ({len(members)})",
                    "multiple": True,
                    "data": [
                        {
                            "id": m.id,
                            "membership_no": m.membership_no,
                            "full_name": m.full_name
                        }
                        for m in members[:10]  # Limit to 10 results
                    ]
                }

    return {
        "success": False,
        "message": "Record nahi mila"
    }
