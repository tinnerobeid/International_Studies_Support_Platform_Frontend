from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.db import get_db
from app.models.institution import Institution
from app.schemas.institution import InstitutionOut, InstitutionsResponse

from app.models.scholarship import Scholarship
from app.schemas.scholarship import ScholarshipOut, ScholarshipsResponse


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
        print(f"🔍 Debug: Total scholarships in DB: {total_all}, Query count: {total}")
        if total != total_all:
            print(f"⚠️ Warning: Count mismatch! Check for NULL values or data issues.")
    
    offset = (page - 1) * page_size
    results = query.offset(offset).limit(page_size).all()

    return ScholarshipsResponse(
        total=total,
        page=page,
        page_size=page_size,
        results=[ScholarshipOut.model_validate(r) for r in results],
    )

