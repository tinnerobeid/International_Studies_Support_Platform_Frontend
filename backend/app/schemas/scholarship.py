# app/schemas/scholarship.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List

class ScholarshipOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    provider: str
    provider_type: Optional[str] = None
    level: Optional[str] = None
    coverage: Optional[str] = None
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

class ScholarshipDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    title: str = Field(validation_alias="name")
    provider: str
    fundingType: Optional[str] = Field(default="Partial", validation_alias="coverage")
    deadline: Optional[str] = None
    
    # These fields need to be computed or allow defaults since DB is simple strings
    degreeLevels: List[str] = []
    eligibility: List[str] = []
    coverage: List[str] = []
    timeline: List[str] = []
    documentsRequired: List[str] = []
    howToApply: List[str] = []
    applicationLink: Optional[str] = Field(None, validation_alias="link")
    description: Optional[str] = "No description available."
