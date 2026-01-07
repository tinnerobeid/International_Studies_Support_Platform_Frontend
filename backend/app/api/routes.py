from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.core.db import get_db
from app.models.institution import Institution
from app.schemas.institution import InstitutionOut, InstitutionsResponse

from app.models.scholarship import Scholarship
from app.schemas.scholarship import ScholarshipOut, ScholarshipsResponse, ScholarshipDetail

from app.models.program import Program
from app.schemas.program import ProgramOut, ProgramCreate

from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationOut


router = APIRouter(tags=["institutions"])



# university listing endpoint
@router.get("/institutions", response_model=InstitutionsResponse)
def list_institutions(
    q: Optional[str] = None,
    city: Optional[str] = None,
    region: Optional[str] = None,
    institution_type: Optional[str] = Query(default=None, description="Public or Private"),
    level: Optional[str] = None,
    sort: str = "popular",
    page: int = 1,
    page_size: int = 24,
    db: Session = Depends(get_db),
):
    query = db.query(Institution)

    # Search
    if q and q.strip():
        s = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Institution.name.ilike(s),
                Institution.city.ilike(s),
                Institution.region.ilike(s),
            )
        )

    # Filters (case-insensitive)
    if city and city.lower() != "all":
        query = query.filter(Institution.city.ilike(city.strip()))

    if region and region.lower() != "all":
        query = query.filter(Institution.region.ilike(region.strip()))

    if institution_type and institution_type.lower() != "all":
        query = query.filter(Institution.institution_type.ilike(institution_type.strip()))

    if level and level.lower() != "all":
        query = query.filter(Institution.level.ilike(level.strip()))

    # Sorting
    if sort == "az":
        query = query.order_by(Institution.name.asc())
    elif sort == "tuitionLow":
        query = query.order_by(Institution.tuition_min.asc())
    elif sort == "tuitionHigh":
        query = query.order_by(Institution.tuition_max.desc())
    else:
        query = query.order_by(Institution.popular_score.desc())

    total = query.count()

    offset = (page - 1) * page_size
    results = query.offset(offset).limit(page_size).all()

    return InstitutionsResponse(
        total=total,
        page=page,
        page_size=page_size,
        results=[InstitutionOut.model_validate(r) for r in results],
    )

# scholarship listing endpoint
@router.get("/scholarships", response_model=ScholarshipsResponse)
def list_scholarships(
    q: str | None = None,
    provider: str | None = None,
    level: str | None = None,
    coverage: str | None = None,
    eligibility: str | None = None,
    sort: str = "popular",
    page: int = 1,
    page_size: int = 12,
    db: Session = Depends(get_db),
):
    query = db.query(Scholarship)

    if q and q.strip():
        s = f"%{q.strip()}%"
        query = query.filter(Scholarship.name.ilike(s))

    if provider and provider.lower() != "all":
        # Frontend sends "Government", "University", "Foundation" which map to provider_type
        provider_val = provider.strip()
        if provider_val.lower() in ["government", "university", "foundation"]:
            query = query.filter(Scholarship.provider_type.ilike(provider_val))
        else:
            # Fallback to provider field for other values
            query = query.filter(Scholarship.provider.ilike(provider_val))

    if level and level.lower() != "all":
        query = query.filter(Scholarship.level.ilike(level.strip()))

    if coverage and coverage.lower() != "all":
        query = query.filter(Scholarship.coverage.ilike(coverage.strip()))

    if eligibility and eligibility.lower() != "all":
        query = query.filter(Scholarship.eligibility.ilike(eligibility.strip()))

    # Sorting
    if sort == "az":
        query = query.order_by(Scholarship.name.asc())
    elif sort == "stipendHigh":
        # Highest monthly stipend first
        query = query.order_by(Scholarship.stipend.desc().nullslast())
    elif sort == "deadline":
        # Earliest deadline first; stored as string like YYYY-MM-DD, so lexicographic sort works
        query = query.order_by(Scholarship.deadline.asc().nullsLast())
    else:
        # Default: most popular first (handle NULL popular_score)
        query = query.order_by(Scholarship.popular_score.desc().nullslast())

    # Count total matching records
    total = query.count()
    
    # Debug: log counts when no filters applied
    if not any([q, provider, level, coverage, eligibility]):
        total_all = db.query(Scholarship).count()
        print(f"Debug: Total scholarships in DB: {total_all}, Query count: {total}")
        if total != total_all:
            print(f"Warning: Count mismatch! Check for NULL values or data issues.")
    
    offset = (page - 1) * page_size
    results = query.offset(offset).limit(page_size).all()

    return ScholarshipsResponse(
        total=total,
        page=page,
        page_size=page_size,
        results=[ScholarshipOut.model_validate(r) for r in results],
    )

# ==========================
# New Endpoints for Profile/Admin
# ==========================

@router.get("/scholarships/{id}", response_model=ScholarshipDetail)
def get_scholarship(id: int, db: Session = Depends(get_db)):
    sc = db.query(Scholarship).filter(Scholarship.id == id).first()
    if not sc:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    # Transform simple DB fields to list fields expected by frontend
    # This manual mapping is needed because the DB structure is flatter/simpler than the new frontend view
    return ScholarshipDetail(
        id=sc.id,
        title=sc.name,
        provider=sc.provider,
        fundingType=sc.coverage,
        deadline=sc.deadline,
        applicationLink=sc.link,
        degreeLevels=[sc.level] if sc.level else [],
        eligibility=[sc.eligibility] if sc.eligibility else [],
        coverage=[sc.coverage, f"Stipend: {sc.stipend}"] if sc.stipend else [sc.coverage] if sc.coverage else [],
        timeline=["Application Period: Check Website", "Result Announcement: TBD"],
        documentsRequired=["Application Form", "Transcripts", "Recommendation Letters"],
        howToApply=["Data not scraped yet. Please check the website."],
        description=f"Scholarship provided by {sc.provider} ({sc.provider_type})."
    )

@router.get("/institutions/{id}", response_model=InstitutionOut)
def get_institution(id: int, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.id == id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return inst

@router.get("/admin/programs", response_model=List[ProgramOut])
def list_programs(q: Optional[str] = None, university_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Program).options(joinedload(Program.institution))
    if q:
        query = query.filter(Program.name.ilike(f"%{q}%"))
    if university_id:
        query = query.filter(Program.university_id == university_id)
    
    programs = query.all()
    # Map to schema, explicitly setting university_name from the relationship
    return [
        ProgramOut(
            **{k: v for k, v in p.__dict__.items() if not k.startswith('_')},
            university_name=p.institution.name if p.institution else None
        ) 
        for p in programs
    ]

@router.post("/admin/programs", response_model=ProgramOut)
def create_program(param: ProgramCreate, db: Session = Depends(get_db)):
    # Optional: verify university_id exists
    inst = db.query(Institution).filter(Institution.id == param.university_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail=f"University with ID {param.university_id} not found")

    db_program = Program(**param.model_dump())
    db.add(db_program)
    db.commit()
    db.refresh(db_program)
    return db_program

@router.get("/me")
def get_me():
    return {
        "id": "user-123",
        "fullName": "Test Student",
        "email": "student@example.com",
        "nationality": "Tanzanian",
        "currentCountry": "South Korea",
        "targetDegree": "Undergraduate",
        "targetIntake": "Fall 2025",
        "bio": "Interested in Computer Science and AI."
    }


# ==========================
# Applications
# ==========================

@router.get("/admin/applications", response_model=List[ApplicationOut])
def list_applications(q: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Application).options(joinedload(Application.program).joinedload(Program.institution))
    
    if q and q.strip():
        search = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Application.student_name.ilike(search),
                Application.student_email.ilike(search)
            )
        )
    
    apps = query.all()
    
    # Map to schema with flattened fields
    return [
        ApplicationOut(
            **{k: v for k, v in a.__dict__.items() if not k.startswith('_')},
            programName=a.program.name if a.program else "Unknown Program",
            universityName=a.program.institution.name if (a.program and a.program.institution) else "Unknown University"
        )
        for a in apps
    ]

@router.post("/applications", response_model=ApplicationOut)
def create_application(param: ApplicationCreate, db: Session = Depends(get_db)):
    # Verify program exists
    prog = db.query(Program).filter(Program.id == param.program_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
        
    db_app = Application(**param.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    # Reload to get relationships for response
    # For now just return basic info, or re-query
    # Re-querying is cleaner to ensure populated fields
    return ApplicationOut(
            **{k: v for k, v in db_app.__dict__.items() if not k.startswith('_')},
            programName=prog.name,
            universityName=prog.institution.name if prog.institution else "Unknown"
    )

@router.put("/admin/applications/{id}", response_model=ApplicationOut)
def update_application_status(id: int, status: str = Query(..., description="New status"), db: Session = Depends(get_db)):
    app_obj = db.query(Application).filter(Application.id == id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app_obj.status = status
    db.commit()
    db.refresh(app_obj)
    
    # Ensure relationships are loaded for schema
    db.refresh(app_obj, ['program'])
    
    return ApplicationOut(
            **{k: v for k, v in app_obj.__dict__.items() if not k.startswith('_')},
            programName=app_obj.program.name if app_obj.program else "Unknown",
            universityName=app_obj.program.institution.name if (app_obj.program and app_obj.program.institution) else "Unknown"
    )

