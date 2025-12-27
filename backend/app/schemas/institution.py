from typing import List, Optional, Literal
from pydantic import BaseModel, ConfigDict


class InstitutionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: Optional[str] = None
    region: Optional[str] = None

    institution_type: Optional[Literal["Public", "Private"]] = None
    level: Optional[Literal["Undergraduate", "Graduate", "Both"]] = None

    sector: Optional[str] = None
    website: Optional[str] = None
    logo: Optional[str] = None
    cover: Optional[str] = None
    featured: int = 0
    popular_score: int = 50
    tuition_min: int = 3000000
    tuition_max: int = 5000000


class InstitutionsResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[InstitutionOut]
