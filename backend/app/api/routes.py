from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.db import get_db
from app.models.institution import Institution
from app.schemas.institution import InstitutionOut, InstitutionsResponse

router = APIRouter(prefix="/api", tags=["institutions"])


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
