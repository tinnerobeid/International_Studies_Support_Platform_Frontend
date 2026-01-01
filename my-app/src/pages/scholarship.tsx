import { useEffect, useMemo, useState } from "react";
import { fetchScholarships, Scholarship } from "../lib/api";

function formatKRW(n?: number | null) {
  if (!n) return "—";
  return "₩" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type SortKey = "popular" | "az" | "deadline" | "stipendHigh";

export default function Scholarships() {
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
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load scholarships");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [q, provider, level, coverage, eligibility, sort, page]);

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  // dropdowns (can be dynamic later)
  const providers = useMemo(() => ["All", "Government", "University", "Foundation"], []);
  const coverages = useMemo(() => ["All", "Full", "Tuition", "Stipend", "Partial"], []);
  const levels = useMemo(() => ["All", "Undergraduate", "Graduate", "Both"], []);
  const eligibilities = useMemo(() => ["All", "International", "Korean", "Need-based", "Merit-based"], []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Scholarships
            </h1>
            <p className="text-slate-300 mt-2">
              Browse scholarships, filter by level and coverage, and save your shortlist.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            Results:{" "}
            <span className="text-white font-semibold">{data.total}</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <label className="text-xs text-slate-400">Search</label>
              <input
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Search scholarships..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Provider</label>
              <select
                value={provider}
                onChange={(e) => {
                  setPage(1);
                  setProvider(e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {providers.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Level</label>
              <select
                value={level}
                onChange={(e) => {
                  setPage(1);
                  setLevel(e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Coverage</label>
              <select
                value={coverage}
                onChange={(e) => {
                  setPage(1);
                  setCoverage(e.target.value);
                }}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {coverages.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-slate-400">Sort</label>
              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value as SortKey);
                }}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="popular">Popular</option>
                <option value="az">A–Z</option>
                <option value="stipendHigh">Stipend ↑</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
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

            <div className="text-xs text-slate-400">
              Page <span className="text-white">{page}</span> / {totalPages}
            </div>
          </div>
        </div>

        {/* Status */}
        {loading && <div className="mt-6 text-slate-300">Loading scholarships...</div>}
        {error && <div className="mt-6 text-red-300">{error}</div>}

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            !error &&
            data.results.map((s) => {
              const isSaved = !!saved[s.id];

              return (
                <article
                  key={s.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold leading-snug">{s.name}</h2>
                      <p className="text-sm text-slate-300 mt-1">
                        {s.provider ?? "—"} • {s.level ?? "—"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSaved((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                      }
                      className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
                    >
                      {isSaved ? "⭐" : "☆"}
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                    <p className="text-xs text-slate-400">Coverage</p>
                    <p className="text-sm font-semibold">{s.coverage ?? "—"}</p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                      <p className="text-xs text-slate-400">Monthly Stipend</p>
                      <p className="text-sm font-semibold">{formatKRW(s.stipend)}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                      <p className="text-xs text-slate-400">Deadline</p>
                      <p className="text-sm font-semibold">{s.deadline ?? "—"}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2">
                    <button
                      className="rounded-xl bg-white text-slate-900 px-3 py-2 text-sm font-semibold hover:opacity-90"
                      onClick={() => alert(`Open details for: ${s.name}`)}
                    >
                      View
                    </button>

                    <button
                      className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
                      onClick={() => alert(`Start application for: ${s.name}`)}
                    >
                      Apply
                    </button>

                    {s.link ? (
                      <a
                        className="text-sm text-slate-300 hover:text-white hover:underline"
                        href={s.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Link
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">Link</span>
                    )}
                  </div>
                </article>
              );
            })}
        </div>

        {!loading && !error && data.results.length === 0 && (
          <div className="mt-10 text-center text-slate-400">
            No scholarships match your search/filters.
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span className="text-sm text-slate-300">
            Page <span className="text-white font-semibold">{page}</span> of{" "}
            <span className="text-white font-semibold">{totalPages}</span>
          </span>

          <button
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
