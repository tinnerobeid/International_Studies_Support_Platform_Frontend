import csv
from pathlib import Path

from app.core.db import SessionLocal
from app.models.scholarship import Scholarship


CSV_PATH = Path(__file__).parent / "scholarships.csv"


def run():
    db = SessionLocal()

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        inserted = 0
        updated = 0

        for row in reader:
            existing = (
                db.query(Scholarship)
                .filter(Scholarship.name == row["name"])
                .first()
            )

            if existing:
                for k, v in row.items():
                    setattr(existing, k, v or None)
                updated += 1
            else:
                scholarship = Scholarship(**row)
                db.add(scholarship)
                inserted += 1

        db.commit()
        db.close()

    print(f"✅ Inserted {inserted}, Updated {updated} scholarships")


if __name__ == "__main__":
    run()
