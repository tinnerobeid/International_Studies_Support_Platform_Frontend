import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchScholarships, type Scholarship } from "../lib/api";
import { getSession } from "../lib/auth";
import "./styles/scholarship.css";

function formatKRW(n?: number | null) {
  if (!n) return "—";
  return "₩" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type SortKey = "popular" | "az" | "deadline" | "stipendHigh";

export default function Scholarships() {
  const navigate = useNavigate();
  const session = getSession();

  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("All");
  const [level, setLevel] = useState("All");
  const [coverage, setCoverage] = useState("All");
  const [eligibility, setEligibility] = useState("All");
  const [sort, setSort] = useState<SortKey>("popular");

  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<{ total: number; results: Scholarship[] }>({
    total: 0,
    results: [],
  });

  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const skeletonItems = useMemo(() => Array.from({ length: pageSize }, (_, i) => i), [pageSize]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchScholarships({
          q,
          provider,
          level,
          coverage,
          eligibility,
          sort,
          page,
          page_size: pageSize,
        });

        if (!cancelled) {
          setData({ total: res.total, results: res.results });
          // Debug: log API response
          console.log(`Scholarships API response: total=${res.total}, results=${res.results.length}`);
          if (res.total === 0) {
            console.warn("API returned 0 scholarships. Check if database has data.");
          }
        }
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : "Failed to load scholarships";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [q, provider, level, coverage, eligibility, sort, page]);

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (session) {
      navigate("/profile");
    } else {
      navigate("/login?as=student&next=/profile");
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  // dropdowns (can be dynamic later)
  const providers = useMemo(() => ["All", "Government", "University", "Foundation"], []);
  const coverages = useMemo(() => ["All", "Full", "Tuition", "Stipend", "Partial"], []);
  const levels = useMemo(() => ["All", "Undergraduate", "Graduate", "Both"], []);
  // const eligibilities = useMemo(() => ["All", "International", "Korean", "Need-based", "Merit-based"], []);

  return (
    <div className="u-page">
      {/* Topbar (match Universities layout) */}
      <div className="u-topbar">
        <div className="u-brand">K-Study</div>
        <div className="u-navlinks">
          <a href="/">Discover</a>
          <a href="/universities">Universities</a>
          <a href="/scholarships">Scholarships</a>
          <a href="#" onClick={handleApplyClick}>Applying</a>
        </div>
      </div>

      {/* Hero */}
      <div className="u-hero">
        <div className="u-hero-inner">
          <h1 className="u-hero-title">Search</h1>
          <p className="u-hero-subtitle">Scholarships and funding</p>

          <div className="u-searchwrap">
            <input
              className="u-searchinput"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Search for scholarships"
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
              <option value="stipendHigh">Stipend ↑</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filters chips */}
      <div className="u-filtersbar">
        <div className="u-filters-inner">
          <div className="u-chip">
            <label>Provider</label>
            <select
              value={provider}
              onChange={(e) => {
                setPage(1);
                setProvider(e.target.value);
              }}
            >
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
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
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="u-chip">
            <label>Coverage</label>
            <select
              value={coverage}
              onChange={(e) => {
                setPage(1);
                setCoverage(e.target.value);
              }}
            >
              {coverages.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            className="u-chip"
            onClick={() => {
              setQ("");
              setProvider("All");
              setLevel("All");
              setCoverage("All");
              setEligibility("All");
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
          {loading && <div className="text-white/80">Loading scholarships...</div>}
          {error && <div className="text-red-300">{error}</div>}

          <section className="cards">
            <div className="container cards-grid">
              {loading &&
                !error &&
                skeletonItems.map((i) => (
                  <article key={`skeleton-${i}`} className="card">
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: "20px", width: "75%", background: "rgba(255,255,255,0.1)", borderRadius: "4px", marginBottom: "8px" }}></div>
                          <div style={{ height: "16px", width: "50%", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }}></div>
                        </div>
                        <div style={{ height: "24px", width: "24px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }}></div>
                      </div>
                      <div style={{ height: "60px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "12px" }}></div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div style={{ height: "50px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}></div>
                        <div style={{ height: "50px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}></div>
                      </div>
                    </div>
                  </article>
                ))}

              {!loading &&
                !error &&
                data.results.map((s) => {
                  const isSaved = !!saved[s.id];

                  return (
                    <article key={s.id} className="card">
                      <div className="card-body" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <div style={{ flex: 1 }}>
                            <h3 className="institution-title" style={{ marginBottom: "6px" }}>{s.name}</h3>
                            <p className="institution-meta">
                              {s.provider ?? "—"} • {s.level ?? "—"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSaved((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                            }
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "8px",
                              padding: "6px 10px",
                              cursor: "pointer",
                              color: "#fff",
                              fontSize: "18px"
                            }}
                          >
                            {isSaved ? "⭐" : "☆"}
                          </button>
                        </div>

                        {(s.provider_type || s.eligibility) && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                            {s.provider_type && (
                              <span style={{
                                fontSize: "11px",
                                padding: "4px 8px",
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "6px",
                                border: "1px solid rgba(255,255,255,0.15)"
                              }}>
                                {s.provider_type}
                              </span>
                            )}
                            {s.eligibility && (
                              <span style={{
                                fontSize: "11px",
                                padding: "4px 8px",
                                background: "rgba(59, 130, 246, 0.2)",
                                borderRadius: "6px",
                                border: "1px solid rgba(59, 130, 246, 0.4)"
                              }}>
                                {s.eligibility}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="u-tuition" style={{ marginBottom: "12px" }}>
                          <span>Coverage</span>
                          <strong>{s.coverage ?? "—"}</strong>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                          <div className="u-tuition">
                            <span>Monthly Stipend</span>
                            <strong>{formatKRW(s.stipend)}</strong>
                          </div>
                          <div className="u-tuition">
                            <span>Deadline</span>
                            <strong>{s.deadline ?? "—"}</strong>
                          </div>
                        </div>

                        <div className="u-actions" style={{ marginTop: "auto" }}>
                          <button
                            onClick={() => alert(`Open details for: ${s.name}`)}
                          >
                            View
                          </button>
                          {s.link && (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Link
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>

          {!loading && !error && data.results.length === 0 && (
            <div className="u-empty">No scholarships match your filters.</div>
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
              Page <b className="text-white">{page}</b> of{" "}
              <b className="text-white">{totalPages}</b>
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
