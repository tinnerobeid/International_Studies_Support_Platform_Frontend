from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base

class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    university_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    level = Column(String, nullable=False)  # Bachelors, Masters, PhD
    department = Column(String, nullable=True)
    tuition_per_semester = Column(Integer, nullable=True)
    language = Column(String, default="English")
    intake = Column(String, default="Spring")
    duration_years = Column(Integer, default=4)

    institution = relationship("Institution", back_populates="programs")
