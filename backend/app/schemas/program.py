from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class ProgramBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str
    university_id: int = Field(alias="universityId")
    level: str
    department: Optional[str] = None
    tuition_per_semester: Optional[int] = Field(None, alias="tuitionPerSemester")
    language: Optional[str] = "English"
    intake: Optional[str] = "Spring"
    duration_years: Optional[int] = Field(4, alias="durationYears")

class ProgramCreate(ProgramBase):
    pass

class ProgramOut(ProgramBase):
    id: int
    university_name: Optional[str] = Field(None, alias="universityName")
    
    class Config:
        from_attributes = True
