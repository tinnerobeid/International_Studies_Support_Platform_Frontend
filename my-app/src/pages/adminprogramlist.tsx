import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/adminlayout";
import "./styles/admin_dashboard.css";

type Program = {
  id: number;
  name: string;
  universityName?: string;
  level: string;
  department?: string;
  // add other fields if needed
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function listPrograms(q?: string): Promise<Program[]> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  const res = await fetch(`${API_BASE}/admin/programs${qs}`);
  if (!res.ok) throw new Error("Failed to load programs");
  return res.json();
}

export default function AdminProgramsListPage() {
  const [q, setQ] = useState("");

  const queryKey = useMemo(() => ["admin-programs", q.trim()], [q]);
  const programsQ = useQuery({
    queryKey,
    queryFn: () => listPrograms(q.trim() || undefined),
  });

  const programs = programsQ.data ?? [];

  return (
    <AdminLayout
      title="Programs"
      subtitle="Create and manage university programs."
      rightSlot={
        <Link className="ad-btn primary" to="/admin/programs/new">
          + New Program
        </Link>
      }
    >
      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search programs..."
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', width: '100%', maxWidth: 300 }}
        />
      </div>

      {/* Stats row */}
      <div className="ad-stats">
        <div className="ad-stat"><div className="k">{programs.length}</div><div className="l">Total Programs</div></div>
        {/* Placeholder stats */}
        <div className="ad-stat"><div className="k">—</div><div className="l">Universities</div></div>
      </div>

      {/* Table card */}
      <div className="ad-card">
        <div className="ad-card-head">
          <div className="ad-card-title">All Programs</div>
          {programsQ.isLoading && <span style={{ marginLeft: 10, fontSize: 12, color: '#666' }}>Loading...</span>}
        </div>

        {programsQ.isError && (
          <div style={{ padding: 20, color: 'red' }}>Error: {(programsQ.error as Error).message}</div>
        )}

        <table className="ad-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>University</th>
              <th>Level</th>
              <th>Department</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {programs.map((p) => (
              <tr className="ad-row" key={p.id}>
                <td>{p.name}</td>
                <td>{p.universityName ?? "—"}</td>
                <td>{p.level}</td>
                <td>{p.department ?? "—"}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="ad-btn" type="button" onClick={() => alert(`Edit ${p.id}`)}>Edit</button>
                </td>
              </tr>
            ))}
            {!programsQ.isLoading && programs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#666' }}>
                  No programs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

