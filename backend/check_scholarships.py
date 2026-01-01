#!/usr/bin/env python
import sys
sys.path.insert(0, '.')
from app.core.db import SessionLocal
from app.models.scholarship import Scholarship

db = SessionLocal()
count = db.query(Scholarship).count()
print(f"Total scholarships in DB: {count}")

scholarships = db.query(Scholarship).all()
for s in scholarships:
    print(f"{s.id}: {s.name} - {s.provider}")
    
db.close()
