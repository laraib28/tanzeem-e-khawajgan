from sqlalchemy import Column, Integer, String, Date, Text, DateTime, Enum, Boolean, ForeignKey, Time, DECIMAL, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime, time
from enum import Enum as PyEnum

from database import Base


# ===== ENUMS =====

class GenderEnum(str, PyEnum):
    male = "male"
    female = "female"


class RelationshipTypeEnum(str, PyEnum):
    son_of = "son_of"
    wife_of = "wife_of"
    daughter_of = "daughter_of"


class ApprovalStatusEnum(str, PyEnum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class HallStatusEnum(str, PyEnum):
    active = "active"
    inactive = "inactive"


class BookingStatusEnum(str, PyEnum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class PriorityEnum(str, PyEnum):
    normal = "normal"
    high = "high"
    urgent = "urgent"


class NotificationChannelEnum(str, PyEnum):
    whatsapp = "whatsapp"
    email = "email"
    sms = "sms"


class NotificationStatusEnum(str, PyEnum):
    pending = "pending"
    sent = "sent"
    delivered = "delivered"
    failed = "failed"


# ===== SQLALCHEMY MODEL =====

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    membership_no = Column(String(50), nullable=True)
    gender = Column(String(10), nullable=False)
    full_name = Column(String(255), nullable=False)
    relationship_type = Column(String(20), nullable=False)
    relation_name = Column(String(255), nullable=False)
    father_in_law_name = Column(String(255), nullable=True)
    cnic = Column(String(15), nullable=False)
    country = Column(String(100), nullable=False)
    native_city = Column(String(100), nullable=True)
    current_city = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)  # Legacy field - kept for backward compatibility
    address = Column(Text, nullable=True)
    date_of_birth = Column(Date, nullable=False)
    cast = Column(String(50), nullable=False)
    source_of_income = Column(String(100), nullable=False)
    education = Column(String(100), nullable=False)
    occupation = Column(String(100), nullable=False)
    profession = Column(String(255), nullable=True)
    dependents_count = Column(Integer, nullable=True, default=0)
    dependents_relation = Column(String(255), nullable=True)
    form_received_date = Column(Date, nullable=True)
    verified_by = Column(String(255), nullable=True)
    verification_remarks = Column(Text, nullable=True)
    approval_status = Column(String(20), nullable=True, default="pending")
    membership_issued_date = Column(Date, nullable=True)
    official_signature = Column(String(255), nullable=True)
    office_stamp = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


# ===== BANQUET MODELS =====

class BanquetHall(Base):
    __tablename__ = "banquet_halls"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    amenities = Column(JSON, nullable=True)
    price_per_hour = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    bookings = relationship("Booking", back_populates="hall")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hall_id = Column(Integer, ForeignKey("banquet_halls.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(255), nullable=True)
    event_type = Column(String(100), nullable=True)
    guest_count = Column(Integer, nullable=False)
    special_requirements = Column(Text, nullable=True)
    status = Column(String(20), default="pending")
    priority = Column(String(20), default="normal")
    whatsapp_optin = Column(Boolean, default=False)
    booking_reference = Column(String(20), unique=True, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    hall = relationship("BanquetHall", back_populates="bookings")
    audit_logs = relationship("BookingAuditLog", back_populates="booking")
    notifications = relationship("NotificationLog", back_populates="booking")


class BookingAuditLog(Base):
    __tablename__ = "booking_audit_log"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    action = Column(String(50), nullable=False)
    actor = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    booking = relationship("Booking", back_populates="audit_logs")


class NotificationLog(Base):
    __tablename__ = "notification_log"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    channel = Column(String(20), nullable=False)
    template_id = Column(String(50), nullable=False)
    recipient = Column(String(255), nullable=False)
    status = Column(String(20), default="pending")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    booking = relationship("Booking", back_populates="notifications")


# ===== PYDANTIC SCHEMAS =====

class MembershipCreate(BaseModel):
    membership_no: Optional[str] = None
    gender: GenderEnum
    full_name: str = Field(..., min_length=1, max_length=255)
    relationship_type: RelationshipTypeEnum
    relation_name: str = Field(..., min_length=1, max_length=255)
    father_in_law_name: Optional[str] = None
    cnic: str = Field(..., min_length=13, max_length=15)
    country: str = Field(..., min_length=1, max_length=100)
    native_city: str = Field(..., min_length=1, max_length=100)
    current_city: str = Field(..., min_length=1, max_length=100)
    address: str = Field(..., min_length=1, max_length=500)
    city: Optional[str] = None  # Legacy field

    @field_validator('membership_no')
    @classmethod
    def validate_membership_no(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == '':
            return v
        if len(v) != 5 or not v.isalnum():
            raise ValueError('Membership number must be exactly 5 alphanumeric characters')
        return v.upper()
    date_of_birth: date
    cast: str = Field(..., min_length=1, max_length=50)
    source_of_income: str = Field(..., min_length=1, max_length=100)
    education: str = Field(..., min_length=1, max_length=100)
    occupation: str = Field(..., min_length=1, max_length=100)
    profession: Optional[str] = None
    dependents_count: Optional[int] = Field(default=0, ge=0)
    dependents_relation: Optional[str] = None
    form_received_date: Optional[date] = None
    verified_by: Optional[str] = None
    verification_remarks: Optional[str] = None
    approval_status: Optional[ApprovalStatusEnum] = ApprovalStatusEnum.pending
    membership_issued_date: Optional[date] = None
    official_signature: Optional[str] = None
    office_stamp: Optional[str] = None

    @field_validator('cnic')
    @classmethod
    def validate_cnic(cls, v: str) -> str:
        clean_cnic = v.replace("-", "")
        if not clean_cnic.isdigit() or len(clean_cnic) != 13:
            raise ValueError('CNIC must be 13 digits')
        return v

    class Config:
        from_attributes = True


class MembershipResponse(BaseModel):
    id: int
    membership_no: Optional[str]
    full_name: str
    cnic: str
    approval_status: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: MembershipResponse


# ===== BANQUET PYDANTIC SCHEMAS =====

class HallResponse(BaseModel):
    id: int
    name: str
    capacity: int
    amenities: Optional[List[str]] = None
    price_per_hour: float
    status: str

    class Config:
        from_attributes = True


class HallListResponse(BaseModel):
    success: bool
    data: List[HallResponse]


class TimeSlot(BaseModel):
    start: str
    end: str


class AvailabilityResponse(BaseModel):
    success: bool
    data: dict


class BookingCreate(BaseModel):
    hall_id: int
    booking_date: date
    start_time: time
    end_time: time
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_phone: str = Field(..., min_length=10, max_length=20)
    customer_email: Optional[str] = None
    event_type: Optional[str] = None
    guest_count: int = Field(..., gt=0)
    special_requirements: Optional[str] = None
    whatsapp_optin: bool = False

    @field_validator('customer_phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        clean_phone = v.replace("-", "").replace(" ", "").replace("+", "")
        if not clean_phone.isdigit() or len(clean_phone) < 10:
            raise ValueError('Invalid phone number format')
        return v

    class Config:
        from_attributes = True


class BookingResponse(BaseModel):
    id: int
    booking_reference: Optional[str]
    hall_id: int
    booking_date: date
    start_time: time
    end_time: time
    customer_name: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True


class BookingSuccessResponse(BaseModel):
    success: bool
    message: str
    data: BookingResponse


class EscalateRequest(BaseModel):
    priority: PriorityEnum
    reason: Optional[str] = None


class EscalateResponse(BaseModel):
    success: bool
    message: str
    data: dict


class WhatsAppRequest(BaseModel):
    booking_id: int
    template_id: str
    recipient_phone: str


class WhatsAppResponse(BaseModel):
    success: bool
    message: str
    data: dict


# ===== CHAT HISTORY MODEL =====

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(100), nullable=False, index=True)
    user_message = Column(Text, nullable=False)
    assistant_message = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class ChatHistoryCreate(BaseModel):
    session_id: str
    user_message: str
    assistant_message: str
    timestamp: Optional[str] = None


class ChatHistoryResponse(BaseModel):
    success: bool
    message: str
