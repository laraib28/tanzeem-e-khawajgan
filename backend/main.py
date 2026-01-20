from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Member, MembershipCreate, MembershipResponse, SuccessResponse

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Tanzeem-e-Khawjgan Membership API",
    description="API for membership form submissions",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://tanzeem-e-khawjgan.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Tanzeem-e-Khawjgan Membership API", "status": "running"}


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
            city=membership.city,
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
