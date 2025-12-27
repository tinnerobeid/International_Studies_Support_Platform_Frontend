# app/models/institution.py
from sqlalchemy import Column, Integer, String
from app.core.db import Base

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    city = Column(String, index=True)
    region = Column(String, index=True)

    institution_type = Column(String, index=True)  # Public / Private
    level = Column(String, index=True)              # Undergraduate / Graduate / Both

    sector = Column(String, default="Private")
    website = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    cover = Column(String, nullable=True)
    featured = Column(Integer, default=0) # 0=False, 1=True (using Integer for compatibility/simplicity, or Boolean if supported)
    popular_score = Column(Integer, default=50)
    tuition_min = Column(Integer, default=3000000)
    tuition_max = Column(Integer, default=5000000)
