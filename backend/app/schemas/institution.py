from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class InstitutionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: Optional[str] = None
    region: Optional[str] = None

    institution_type: Optional[str] = None
    level: Optional[str] = None

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
