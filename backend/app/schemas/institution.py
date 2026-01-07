from typing import List, Optional, ForwardRef
from pydantic import BaseModel, ConfigDict
from app.schemas.program import ProgramOut


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
    
    # We use ForwardRef or string type hint if strictly needed, but here simple import is fine if no circular dependency
    # However, to be safe from circular imports, we might need a separate Schema for Programs here or use generic list
    # Let's try to assume we can import ProgramOut next step.
    # actually, let's keep it simple.
    programs: List['ProgramOut'] = []



class InstitutionsResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[InstitutionOut]
