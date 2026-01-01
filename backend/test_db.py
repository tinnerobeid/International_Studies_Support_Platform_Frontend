import sys
sys.path.insert(0, '.')
from app.core.db import SessionLocal, engine
from app.models.scholarship import Scholarship
from sqlalchemy import inspect

# Check if table exists
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tables in database: {tables}")

# Check scholarship count
db = SessionLocal()
count = db.query(Scholarship).count()
print(f"Scholarships in database: {count}")

if count > 0:
    first = db.query(Scholarship).first()
    print(f"First scholarship: {first.name if first else 'None'}")

db.close()
