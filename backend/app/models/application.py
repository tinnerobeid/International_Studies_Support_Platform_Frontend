from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.db import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=True)
    
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    
    # We can perform a lookup to populate uni name, or store uni_id if needed directly
    # referencing program.university
    
    status = Column(String, default="Submitted")  # Submitted, Under Review, Accepted, Rejected
    submitted_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program")
