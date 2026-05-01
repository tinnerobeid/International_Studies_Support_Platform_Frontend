import csv
import json
from pathlib import Path

# Paths
current_dir = Path(__file__).parent
csv_path = current_dir / "scholarships.csv"
output_path = current_dir.parent / "src" / "data" / "scholarships.ts"

def to_int(value):
  if value is None: return None
  v = str(value).strip()
  if v == "" or v.lower() == "null" or v == "-": return None
  v = v.replace(",", "")
  try: return int(float(v))
  except: return None

def norm(value):
  if value is None: return None
  v = str(value).strip()
  return v if v != "" else None

def run():
    results = []
    
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = norm(row.get("name") or row.get("scholarship_name"))
            if not name: continue

            id_val = to_int(row.get("id"))
            # If ID is missing, we could generate one, but let's trust valid rows usually have IDs or just use what's there
            if not id_val:
                # auto-increment logic if needed, but CSV seems to have IDs
                id_val = len(results) + 1

            results.append({
                "id": id_val,
                "name": name,
                "provider": norm(row.get("provider")) or "Unknown",
                "provider_type": norm(row.get("provider_type")) or "Unknown",
                "level": norm(row.get("level")) or "Both",
                "coverage": norm(row.get("coverage")) or "Unknown",
                "stipend": to_int(row.get("stipend")),
                "eligibility": norm(row.get("eligibility")) or "",
                "deadline": norm(row.get("deadline")) or "",
                "link": norm(row.get("link")) or "",
                "popular_score": to_int(row.get("popular_score")) or 0
            })

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("export const scholarships = ")
        json.dump(results, f, indent=2, ensure_ascii=False)
        f.write(";\n")

    print(f"Generated {len(results)} scholarships at {output_path}")

if __name__ == "__main__":
    run()
