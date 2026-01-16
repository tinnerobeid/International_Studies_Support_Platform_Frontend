import sys
from pathlib import Path

# Add parent directory to path so we can import app
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

import pandas as pd
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.models.institution import Institution

XLSX_PATH = Path(__file__).parent / "moe_universities.xlsx"

# Korean → English REGION mapping (your existing one)
REGION_MAP = {
    "서울": "Seoul",
    "부산": "Busan",
    "대구": "Daegu",
    "인천": "Incheon",
    "광주": "Gwangju",
    "대전": "Daejeon",
    "울산": "Ulsan",
    "세종": "Sejong",
    "경기": "Gyeonggi",
    "강원": "Gangwon",
    "충북": "Chungbuk",
    "충남": "Chungnam",
    "전북": "Jeonbuk",
    "전남": "Jeonnam",
    "경북": "Gyeongbuk",
    "경남": "Gyeongnam",
    "제주": "Jeju",
}

# FIRST TOKEN of Korean road-name address → English CITY/PROVINCE
# (ex: "서울특별시" -> "Seoul", "강원특별자치도" -> "Gangwon")
CITY_MAP = {
    "서울특별시": "Seoul",
    "부산광역시": "Busan",
    "대구광역시": "Daegu",
    "인천광역시": "Incheon",
    "광주광역시": "Gwangju",
    "대전광역시": "Daejeon",
    "울산광역시": "Ulsan",
    "세종특별자치시": "Sejong",
    "경기도": "Gyeonggi",
    "강원도": "Gangwon",
    "강원특별자치도": "Gangwon",
    "충청북도": "Chungbuk",
    "충청남도": "Chungnam",
    "전라북도": "Jeonbuk",
    "전북특별자치도": "Jeonbuk",
    "전라남도": "Jeonnam",
    "경상북도": "Gyeongbuk",
    "경상남도": "Gyeongnam",
    "제주특별자치도": "Jeju",
}

def normalize_level(value: str) -> str:
    if not value or value.lower() == "nan":
        return "Both"
    if "대학원" in value:
        return "Graduate"
    # "대학" appears in many things; keep it simple
    if "대학" in value:
        return "Undergraduate"
    return "Both"

def normalize_type(value: str) -> str:
    if not value or value.lower() == "nan":
        return "Private"
    if "국립" in value or "공립" in value:
        return "Public"
    return "Private"

def safe_str(x) -> str:
    s = str(x).strip()
    return "" if s.lower() == "nan" else s

def pick_city(address: str, region_kr: str) -> str:
    """
    address usually starts with:
      서울특별시 / 부산광역시 / 강원특별자치도 ...
    We map that first token into English.
    Fallback to region (converted) if address missing.
    """
    address = safe_str(address)
    if not address:
        return REGION_MAP.get(region_kr, region_kr)

    first = address.split()[0].strip()
    if first in CITY_MAP:
        return CITY_MAP[first]

    # fallback: if first token isn't in map, try region_kr -> region
    return REGION_MAP.get(region_kr, region_kr)

def run():
    df = pd.read_excel(XLSX_PATH)

    db: Session = SessionLocal()
    inserted, updated = 0, 0

    for _, row in df.iterrows():
        name_en = safe_str(row.get("학교명(영문)"))
        if not name_en:
            continue

        region_kr = safe_str(row.get("지역"))
        region = REGION_MAP.get(region_kr, region_kr)

        address = row.get("도로명 주소")
        city = pick_city(address, region_kr)

        institution_type = normalize_type(safe_str(row.get("설립구분")))
        level = normalize_level(safe_str(row.get("학제")))

        website = safe_str(row.get("학교홈페이지")) or None

        # DEDUPE by name (avoid duplicates)
        inst = db.query(Institution).filter(Institution.name == name_en).first()

        if inst:
            inst.city = city
            inst.region = region
            inst.institution_type = institution_type
            inst.level = level
            inst.website = website
            updated += 1
        else:
            db.add(
                Institution(
                    name=name_en,
                    city=city,
                    region=region,
                    institution_type=institution_type,
                    level=level,
                    website=website,
                    popular_score=50,
                )
            )
            inserted += 1

    db.commit()
    db.close()

    print(f"Inserted {inserted} new institutions")
    print(f"Updated {updated} existing institutions")

if __name__ == "__main__":
    run()
