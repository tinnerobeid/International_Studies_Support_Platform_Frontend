#!/usr/bin/env python
import sys
sys.path.insert(0, '.')
import json
from app.core.db import SessionLocal
from app.models.scholarship import Scholarship

db = SessionLocal()

# Get all scholarships sorted by popular score
scholarships = db.query(Scholarship).order_by(Scholarship.popular_score.desc()).all()

# Convert to dict format
results = []
for s in scholarships:
    results.append({
        "id": s.id,
        "name": s.name,
        "provider": s.provider,
        "provider_type": s.provider_type,
        "level": s.level,
        "coverage": s.coverage,
        "stipend": s.stipend,
        "eligibility": s.eligibility,
        "deadline": s.deadline,
        "link": s.link,
        "popular_score": s.popular_score,
    })

# Print as JSON response format
response = {
    "total": len(results),
    "page": 1,
    "page_size": 50,
    "results": results
}

print(json.dumps(response, indent=2, ensure_ascii=False))

db.close()
