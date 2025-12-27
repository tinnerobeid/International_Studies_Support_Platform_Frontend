import { useMemo, useState } from "react";
import rawData from "../data/institutions.kr.json";

type Region = "Seoul" | "Gyeonggi" | "Busan" | "Jeju" | "Other";
type Sector = "Public" | "Private";
type Level = "Undergraduate" | "Postgraduate" | "Both";
type InstitutionType = "University" | "Junior College" | "Cyber University" | "Graduate School";

type Institution = {
  name: string;
  city: string;
  region: Region;
  sector: Sector;
  institutionType: InstitutionType;
  level: Level;
  tuitionMin?: number;
  tuitionMax?: number;
  tags?: string[];
  website?: string;
  logo?: string;
  cover?: string;
  featured?: boolean;
};

const SOUTH_KOREA_CITIES = [
  "Seoul","Busan","Incheon","Daegu","Daejeon","Gwangju","Ulsan","Sejong",
  "Suwon","Yongin","Goyang","Seongnam","Bucheon","Ansan","Anyang","Hwaseong",
  "Pyeongtaek","Osan","Gimpo","Paju","Uijeongbu","Namyangju","Hanam","Icheon",
  "Chuncheon","Wonju","Gangneung","Cheongju","Cheonan","Asan","Gongju","Nonsan",
  "Seosan","Dangjin","Jeonju","Iksan","Gunsan","Yeosu","Suncheon","Mokpo","Naju",
  "Pohang","Gyeongju","Gimcheon","Andong","Gumi","Yeongju","Sangju","Miryang",
  "Yangsan","Geoje","Tongyeong","Jinju","Changwon","Sacheon","Jeju","Other"
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatKRW(n: number) {
  return "₩" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type SortKey = "popular" | "az" | "tuitionLow" | "tuitionHigh";

export default function Universities() {
  const data = rawData as Institution[];

  const [q, setQ] = useState("");
  const [region, setRegion] = useState<"All" | Region>("All");
  const [city, setCity] = useState("All");
  const [sector, setSector] = useState<"All" | Sector>("All");
  const [institutionType, setInstitutionType] = useState<"All" | InstitutionType>("All");
  const [level, setLevel] = useState<"All" | Level>("All");
  const [sort, setSort] = useState<SortKey>("popular");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  // counts / scores (simple for now)
  const normalized = useMemo(() => {
    return data.map((i, idx) => ({
      ...i,
      id: slugify(i.name),
      tags: i.tags ?? [],
      tuitionMin: i.tuitionMin ?? 0,
      tuitionMax: i.tuitionMax ?? 0,
      popularScore: 50 + (idx % 10),
    }));
  }, [data]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    const base = normalized.filter((u) => {
      const matchesQuery =
        query === "" ||
        u.name.toLowerCase().includes(query) ||
        u.city.toLowerCase().includes(query) ||
        u.tags.some((t) => t.toLowerCase().includes(query));

      const matchesRegion = region === "All" || u.region === region;
      const matchesCity = city === "All" || u.city === city;
      const matchesSector = sector === "All" || u.sector === sector;
      const matchesInstitutionType = institutionType === "All" || u.institutionType === institutionType;
      const matchesLevel = level === "All" || u.level === level;

      return (
        matchesQuery &&
        matchesRegion &&
        matchesCity &&
        matchesSector &&
        matchesInstitutionType &&
        matchesLevel
      );
    });

    const sorted = [...base].sort((a, b) => {
      if (sort === "popular") return (b.popularScore ?? 0) - (a.popularScore ?? 0);
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "tuitionLow") return (a.tuitionMin ?? 0) - (b.tuitionMin ?? 0);
      if (sort === "tuitionHigh") return (b.tuitionMax ?? 0) - (a.tuitionMax ?? 0);
      return 0;
    });

    return sorted;
  }, [normalized, q, region, city, sector, institutionType, level, sort]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Institutions in Korea
            </h1>
            <p className="text-slate-300 mt-2">
              Universities • Junior Colleges • Cyber Universities • Graduate Schools
            </p>
          </div>

          <div className="text-sm text-slate-400">
            Results: <span className="text-white font-semibold">{filtered.length}</span>
          </div>
        </div>

        {/* Filter bar (same style) */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search */}
            <div className="md:col-span-4">
              <label className="text-xs text-slate-400">Search</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, city, tag..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Region */}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {["All", "Seoul", "Gyeonggi", "Busan", "Jeju", "Other"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {["All", ...SOUTH_KOREA_CITIES].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Public/Private */}
            <div className="md:col-span-1">
              <label className="text-xs text-slate-400">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {["All", "Public", "Private"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Institution type */}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Type</label>
              <select
                value={institutionType}
                onChange={(e) => setInstitutionType(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {["All", "University", "Junior College", "Cyber University", "Graduate School"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="md:col-span-1">
              <label className="text-xs text-slate-400">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {["All", "Undergraduate", "Postgraduate", "Both"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-1">
              <label className="text-xs text-slate-400">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="popular">Popular</option>
                <option value="az">A–Z</option>
                <option value="tuitionLow">Tuition ↓</option>
                <option value="tuitionHigh">Tuition ↑</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
              onClick={() => {
                setQ("");
                setRegion("All");
                setCity("All");
                setSector("All");
                setInstitutionType("All");
                setLevel("All");
                setSort("popular");
              }}
            >
              Reset
            </button>

            <div className="text-xs text-slate-400">Tip: Click ⭐ to save a shortlist.</div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u: any) => {
            const isSaved = !!saved[u.id];

            return (
              <article
                key={u.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold leading-snug">{u.name}</h2>
                    <p className="text-sm text-slate-300 mt-1">
                      {u.city} • {u.region} • {u.sector} • {u.institutionType} • {u.level}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={isSaved ? "Unsave" : "Save"}
                    onClick={() => setSaved((prev) => ({ ...prev, [u.id]: !prev[u.id] }))}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
                  >
                    {isSaved ? "⭐" : "☆"}
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <p className="text-xs text-slate-400">Tuition (per semester)</p>
                  <p className="text-sm font-semibold">
                    {formatKRW(u.tuitionMin)} – {formatKRW(u.tuitionMax)}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2">
                  <button
                    className="rounded-xl bg-white text-slate-900 px-3 py-2 text-sm font-semibold hover:opacity-90"
                    onClick={() => alert(`Open details for: ${u.name}`)}
                  >
                    View
                  </button>

                  <button
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
                    onClick={() => alert(`Start application for: ${u.name}`)}
                  >
                    Apply
                  </button>

                  {u.website ? (
                    <a
                      className="text-sm text-slate-300 hover:text-white hover:underline"
                      href={u.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Site
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">Site</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center text-slate-400">
            No institutions match your search/filters.
          </div>
        )}
      </div>
    </div>
  );
}
