from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    student_name: str = Field(alias="studentName")
    student_email: Optional[str] = Field(None, alias="studentEmail")
    program_id: int = Field(alias="programId")
    status: Optional[str] = "Submitted"

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationOut(ApplicationBase):
    id: int
    submitted_at: datetime = Field(alias="submittedAt")
    
    # Flattened fields for easy display
    program_name: Optional[str] = Field(None, alias="programName")
    university_name: Optional[str] = Field(None, alias="universityName")

    class Config:
        from_attributes = True
