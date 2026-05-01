import pandas as pd
import json
from pathlib import Path

# Paths
current_dir = Path(__file__).parent
xlsx_path = current_dir / "moe_universities.xlsx"

# Mappings (copied from seed_from_moe_xlsx.py)
REGION_MAP = {
    "서울": "Seoul", "부산": "Busan", "대구": "Daegu", "인천": "Incheon", 
    "광주": "Gwangju", "대전": "Daejeon", "울산": "Ulsan", "세종": "Sejong", 
    "경기": "Gyeonggi", "강원": "Gangwon", "충북": "Chungbuk", "충남": "Chungnam", 
    "전북": "Jeonbuk", "전남": "Jeonnam", "경북": "Gyeongbuk", "경남": "Gyeongnam", 
    "제주": "Jeju"
}

CITY_MAP = {
    "서울특별시": "Seoul", "부산광역시": "Busan", "대구광역시": "Daegu", 
    "인천광역시": "Incheon", "광주광역시": "Gwangju", "대전광역시": "Daejeon", 
    "울산광역시": "Ulsan", "세종특별자치시": "Sejong", "경기도": "Gyeonggi", 
    "강원도": "Gangwon", "강원특별자치도": "Gangwon", "충청북도": "Chungbuk", 
    "충청남도": "Chungnam", "전라북도": "Jeonbuk", "전북특별자치도": "Jeonbuk", 
    "전라남도": "Jeonnam", "경상북도": "Gyeongbuk", "경상남도": "Gyeongnam", 
    "제주특별자치도": "Jeju"
}

def normalize_level(value):
    s = str(value).strip()
    if not s or s.lower() == "nan": return "Both"
    if "대학원" in s: return "Graduate"
    if "대학" in s: return "Undergraduate"
    return "Both"

def normalize_type(value):
    s = str(value).strip()
    if not s or s.lower() == "nan": return "Private"
    if "국립" in s or "공립" in s: return "Public"
    return "Private"

def safe_str(x):
    s = str(x).strip()
    return "" if s.lower() == "nan" else s

def pick_city(address, region_kr):
    address = safe_str(address)
    if not address: return REGION_MAP.get(region_kr, region_kr)
    first = address.split()[0].strip()
    if first in CITY_MAP: return CITY_MAP[first]
    return REGION_MAP.get(region_kr, region_kr)

def run():
    df = pd.read_excel(xlsx_path)
    results = []
    
    seen_names = set()
    id_counter = 1

    for _, row in df.iterrows():
        name_en = safe_str(row.get("학교명(영문)"))
        if not name_en or name_en in seen_names:
            continue
        seen_names.add(name_en)

        region_kr = safe_str(row.get("지역"))
        region = REGION_MAP.get(region_kr, region_kr)
        address = row.get("도로명 주소")
        city = pick_city(address, region_kr)
        institution_type = normalize_type(row.get("설립구분"))
        level = normalize_level(row.get("학제"))
        website = safe_str(row.get("학교홈페이지")) or None

        results.append({
            "id": id_counter,
            "name": name_en,
            "city": city,
            "region": region,
            "institution_type": institution_type,
            "level": level,
            "website": website,
            "popular_score": 50
        })
        id_counter += 1

    # Output to TypeScript file
    output_path = current_dir.parent / "src" / "data" / "institutions.ts"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("export const institutions = ")
        json.dump(results, f, indent=2, ensure_ascii=False)
        f.write(";\n")

    print(f"Generated {len(results)} institutions at {output_path}")

if __name__ == "__main__":
    run()
