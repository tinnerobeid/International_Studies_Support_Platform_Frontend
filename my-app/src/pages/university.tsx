import { useEffect, useMemo, useState } from "react";
import { fetchInstitutions} from "../lib/api";
import InstitutionCard from "../components/InstitutionCard";
import type { Institution } from "../types/institution";
import "./styles/university.css";

function formatKRW(n?: number) {
  if (!n) return "—";
  return "₩" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type SortKey = "popular" | "az" | "tuitionLow" | "tuitionHigh";

export default function Universities() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const [region, setRegion] = useState("All");
  const [institutionType, setInstitutionType] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState<SortKey>("popular");

  const [page, setPage] = useState(1);
  const pageSize = 9; // show 3x3 grid per page

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<{ total: number; results: Institution[] }>({
    total: 0,
    results: [],
  });

  const regions = useMemo(
    () => [
      "All", "Seoul", "Gyeonggi", "Busan", "Jeju", "Incheon", "Daegu", "Daejeon",
      "Gwangju", "Ulsan", "Sejong", "Gangwon", "Chungbuk", "Chungnam",
      "Jeonbuk", "Jeonnam", "Gyeongbuk", "Gyeongnam",
    ],
    []
  );

  const cities = useMemo(
    () => [
      "All", "Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan",
      "Sejong", "Jeju", "Suwon", "Seongnam", "Yongin", "Goyang", "Changwon",
      "Cheongju", "Jeonju", "Pohang", "Gimhae", "Hwaseong",
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchInstitutions({
          q,
          city,
          region,
          institution_type: institutionType,
          level,
          sort,
          page,
          page_size: pageSize,
        });

        if (!cancelled) {
          setData({ total: res.total, results: res.results });
          // Debug: log if we got results
          if (res.total === 0) {
            console.warn("API returned 0 universities. Check if database is seeded.");
          }
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "Failed to load universities";
          setError(message);
          console.error("Failed to fetch universities:", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [q, city, region, institutionType, level, sort, page]);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div className="u-page">
      {/* Topbar */}
      <div className="u-topbar">
        <div className="u-brand">K-Study</div>
        <div className="u-navlinks">
          <a href="/">Discover</a>
          <a href="/universities">Universities</a>
          <a href="#">Applying</a>
          <a href="#">International</a>
        </div>
      </div>

      {/* Hero */}
      <div className="u-hero">
        <div className="u-hero-inner">
          <h1 className="u-hero-title">Search</h1>
          <p className="u-hero-subtitle">Universities and colleges</p>

          <div className="u-searchwrap">
            <input
              className="u-searchinput"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Search for items"
            />
            <button className="u-searchbtn" onClick={() => setPage(1)}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results bar */}
      <div className="u-resultsbar">
        <div className="u-results-inner">
          <div className="u-results-left">
            <span>
              Results: <b>{data.total}</b>
            </span>
            <span>
              Page <b>{page}</b> of <b>{totalPages}</b>
            </span>
          </div>

          <div className="u-pill">
            <span style={{ opacity: 0.8 }}>Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value as SortKey);
              }}
            >
              <option value="popular">Popular</option>
              <option value="az">A–Z</option>
              <option value="tuitionLow">Tuition ↓</option>
              <option value="tuitionHigh">Tuition ↑</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters chips */}
      <div className="u-filtersbar">
        <div className="u-filters-inner">
          <div className="u-chip">
            <label>Region</label>
            <select
              value={region}
              onChange={(e) => {
                setPage(1);
                setRegion(e.target.value);
              }}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="u-chip">
            <label>City</label>
            <select
              value={city}
              onChange={(e) => {
                setPage(1);
                setCity(e.target.value);
              }}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="u-chip">
            <label>Type</label>
            <select
              value={institutionType}
              onChange={(e) => {
                setPage(1);
                setInstitutionType(e.target.value);
              }}
            >
              {["All", "Public", "Private"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="u-chip">
            <label>Level</label>
            <select
              value={level}
              onChange={(e) => {
                setPage(1);
                setLevel(e.target.value);
              }}
            >
              {["All", "Undergraduate", "Graduate", "Both"].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <button
            className="u-chip"
            onClick={() => {
              setQ("");
              setCity("All");
              setRegion("All");
              setInstitutionType("All");
              setLevel("All");
              setSort("popular");
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="u-content">
        <div className="u-content-inner">
          {loading && <div className="text-white/80">Loading universities...</div>}
          {error && <div className="text-red-300">{error}</div>}

          <section className="cards">
            <div className="container cards-grid mt-6">
            {!loading &&
              !error &&
                data.results.map((u) => (
                <InstitutionCard key={u.id} institution={u as Institution} />
              ))}
            </div>
          </section>

          {!loading && !error && data.results.length === 0 && (
            <div className="mt-10 text-center text-white/60">No universities match your filters.</div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-black/40 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <span className="text-sm text-white/80">
              Page <b className="text-white">{page}</b> of <b className="text-white">{totalPages}</b>
            </span>

            <button
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm hover:bg-black/40 disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
