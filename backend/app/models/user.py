from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    UNIVERSITY = "university"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default=UserRole.STUDENT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
