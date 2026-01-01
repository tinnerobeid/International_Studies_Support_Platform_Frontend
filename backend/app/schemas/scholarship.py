# app/schemas/scholarship.py (example)
from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class ScholarshipOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    provider: str
    provider_type: Optional[str] = None     # don't restrict too hard yet
    level: Optional[str] = None             # "Undergraduate/Graduate/Both"
    coverage: Optional[str] = None          # "Full/Partial/..."
    stipend: Optional[int] = None
    eligibility: Optional[str] = None
    deadline: Optional[str] = None
    link: Optional[str] = None
    popular_score: Optional[int] = None


class ScholarshipsResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[ScholarshipOut]
