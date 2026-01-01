from fastapi import APIRouter
from app.core.db import SessionLocal
from app.models.scholarship import Scholarship

router = APIRouter()

@router.get("/debug/scholarships")
def debug_scholarships():
    db = SessionLocal()
    count = db.query(Scholarship).count()
    scholarships = db.query(Scholarship).limit(10).all()
    db.close()
    
    return {
        "total_count": count,
        "sample": [{"id": s.id, "name": s.name, "provider": s.provider} for s in scholarships]
    }
