from sqlalchemy import Column, Integer, String
from app.core.db import Base

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False, index=True)
    provider = Column(String, nullable=False)        # Ministry / University / Foundation
    provider_type = Column(String, index=True)       # Government / University / Foundation

    level = Column(String, index=True)               # Undergraduate / Graduate / Both
    coverage = Column(String, index=True)            # Full / Partial / Tuition / Stipend

    stipend = Column(Integer, nullable=True)         # KRW per month
    eligibility = Column(String, nullable=True)

    deadline = Column(String, nullable=True)
    link = Column(String, nullable=True)

    popular_score = Column(Integer, default=50)
