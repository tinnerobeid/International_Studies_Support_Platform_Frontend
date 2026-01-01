import csv
from pathlib import Path

from app.db.session import SessionLocal
from app.models.scholarship import Scholarship

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "scholarships.csv"


def to_int(value):
  if value is None:
    return None
  v = str(value).strip()
  if v == "" or v.lower() == "null" or v == "-":
    return None
  # allow "1,000,000"
  v = v.replace(",", "")
  try:
    return int(float(v))
  except:
    return None


def norm(value):
  if value is None:
    return None
  v = str(value).strip()
  return v if v != "" else None


def run():
  db = SessionLocal()

  if not CSV_PATH.exists():
    raise FileNotFoundError(f"❌ scholarships.csv not found at: {CSV_PATH}")

  inserted = 0
  updated = 0

  with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)

    for row in reader:
      name = norm(row.get("name") or row.get("scholarship_name"))
      if not name:
        continue

      # Find existing by name (or you can use id column if your csv has it)
      existing = db.query(Scholarship).filter(Scholarship.name == name).first()

      data = dict(
        name=name,
        provider=norm(row.get("provider")) or "Unknown",
        provider_type=norm(row.get("provider_type")) or norm(row.get("type")) or "Unknown",
        level=norm(row.get("level")) or "Both",
        coverage=norm(row.get("coverage")) or "Unknown",
        stipend=to_int(row.get("stipend")),
        eligibility=norm(row.get("eligibility")) or "",
        deadline=norm(row.get("deadline")) or "",
        link=norm(row.get("link")) or norm(row.get("url")),
        popular_score=to_int(row.get("popular_score")) or 0,
      )

      if existing:
        for k, v in data.items():
          setattr(existing, k, v)
        updated += 1
      else:
        db.add(Scholarship(**data))
        inserted += 1

  db.commit()
  db.close()

  print(f"✅ Seeded scholarships from CSV: inserted={inserted}, updated={updated}")
  print(f"📄 Source: {CSV_PATH}")


if __name__ == "__main__":
  run()
