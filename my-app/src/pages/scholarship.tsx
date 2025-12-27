import { useMemo, useState } from "react";

type Scholarship = {
  id: string;
  name: string;
  provider: string; // Government / University / Foundation
  level: "Undergraduate" | "Graduate" | "Both";
  coverage: string; // Tuition / Stipend / Full
  stipend?: number; // KRW per month (optional)
  deadline: string; // display string for now
  eligibilityTags: string[];
  link?: string;
  popularScore?: number;
};

const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "gks",
    name: "Global Korea Scholarship (GKS)",
    provider: "Government",
    level: "Both",
    coverage: "Full tuition + monthly stipend",
    stipend: 1000000,
    deadline: "Varies (Spring/Fall)",
    eligibilityTags: ["International", "Topik support", "Competitive"],
    link: "https://www.studyinkorea.go.kr",
    popularScore: 99,
  },
  {
    id: "kaist-aid",
    name: "KAIST International Student Scholarship",
    provider: "University",
    level: "Both",
    coverage: "Tuition reduction + stipend (varies)",
    stipend: 350000,
    deadline: "Depends on admission round",
    eligibilityTags: ["STEM", "Merit-based", "International"],
    link: "https://www.kaist.ac.kr",
    popularScore: 92,
  },
  {
    id: "yonsei-global",
    name: "Yonsei Global Leader Scholarship",
    provider: "University",
    level: "Undergraduate",
    coverage: "Partial tuition (varies)",
    deadline: "Before semester start",
    eligibilityTags: ["Leadership", "Merit-based", "International"],
    link: "https://www.yonsei.ac.kr",
    popularScore: 85,
  },
  {
    id: "kdu-support",
    name: "KDU Global Campus International Support",
    provider: "University",
    level: "Undergraduate",
    coverage: "Tuition discount (varies)",
    deadline: "Rolling / per intake",
    eligibilityTags: ["International", "Global Campus", "Need-based"],
    link: "https://www.kduniv.ac.kr",
    popularScore: 70,
  },
];

function formatKRW(n: number) {
  return "₩" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type SortKey = "popular" | "az" | "deadline" | "stipendHigh";

export default function Scholarships() {
  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("All");
  const [level, setLevel] = useState("All");
  const [coverage, setCoverage] = useState("All");
  const [sort, setSort] = useState<SortKey>("popular");

  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const providers = useMemo(() => {
    const set = new Set(SCHOLARSHIPS.map((s) => s.provider));
    return ["All", ...Array.from(set)];
  }, []);

  const coverages = useMemo(() => {
    const set = new Set(SCHOLARSHIPS.map((s) => s.coverage));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    const base = SCHOLARSHIPS.filter((s) => {
      const matchesQuery =
        query === "" ||
        s.name.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        s.eligibilityTags.some((t) => t.toLowerCase().includes(query));

      const matchesProvider = provider === "All" || s.provider === provider;
      const matchesLevel = level === "All" || s.level === level;
      const matchesCoverage = coverage === "All" || s.coverage === coverage;

      return matchesQuery && matchesProvider && matchesLevel && matchesCoverage;
    });

    const sorted = [...base].sort((a, b) => {
      if (sort === "popular") return (b.popularScore ?? 0) - (a.popularScore ?? 0);
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "stipendHigh") return (b.stipend ?? 0) - (a.stipend ?? 0);
      // deadline sort is placeholder (string), we keep it stable for now
      if (sort === "deadline") return a.deadline.localeCompare(b.deadline);
      return 0;
    });

    return sorted;
  }, [q, provider, level, coverage, sort]);

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
            <span className="text-white font-semibold">{filtered.length}</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {/* Search */}
            <div className="md:col-span-5">
              <label className="text-xs text-slate-400">Search</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by scholarship, provider, tags..."
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Provider */}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {["All", "Undergraduate", "Graduate", "Both"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Coverage */}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Coverage</label>
              <select
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              >
                {coverages.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                setSort("popular");
              }}
            >
              Reset
            </button>

            <div className="text-xs text-slate-400">
              Tip: Click ⭐ to save scholarships you like.
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const isSaved = !!saved[s.id];

            return (
              <article
                key={s.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm hover:border-slate-700 transition"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold leading-snug">{s.name}</h2>
                    <p className="text-sm text-slate-300 mt-1">
                      {s.provider} • {s.level}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={isSaved ? "Unsave scholarship" : "Save scholarship"}
                    onClick={() =>
                      setSaved((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                    }
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm hover:bg-slate-900"
                  >
                    {isSaved ? "⭐" : "☆"}
                  </button>
                </div>

                {/* Coverage */}
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                  <p className="text-xs text-slate-400">Coverage</p>
                  <p className="text-sm font-semibold">{s.coverage}</p>
                </div>

                {/* Stipend + Deadline */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                    <p className="text-xs text-slate-400">Monthly Stipend</p>
                    <p className="text-sm font-semibold">
                      {s.stipend ? formatKRW(s.stipend) : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                    <p className="text-xs text-slate-400">Deadline</p>
                    <p className="text-sm font-semibold">{s.deadline}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.eligibilityTags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-full border border-blue-900 bg-blue-950/40 px-2 py-1 text-blue-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
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

        {filtered.length === 0 && (
          <div className="mt-10 text-center text-slate-400">
            No scholarships match your search/filters.
          </div>
        )}
      </div>
    </div>
  );
}
