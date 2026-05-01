import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./styles/applications.css";

type ApplicationOut = {
  id: number;
  studentName: string;
  studentEmail?: string;
  programName?: string;
  universityName?: string;
  status: string;
  submittedAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function fetchApplications(q: string): Promise<ApplicationOut[]> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  const res = await fetch(`${API_BASE}/admin/applications${qs}`);
  if (!res.ok) throw new Error("Failed to load applications");
  return res.json();
}

export default function AdminApplicationsListPage() {
  const [q, setQ] = useState("");

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ["admin-applications", q],
    queryFn: () => fetchApplications(q),
  });

  return (
    <div className="app-wrap">
      <div className="hrow">
        <div>
          <h1 className="htitle">Admin — Applications Review</h1>
          <p className="hsub">Review student applications and update outcomes.</p>
        </div>
        <Link className="btn" to="/admin/programs">Admin Programs</Link>
      </div>

      <div className="card">
        <input
          className="field input"
          style={{ width: 360 }}
          placeholder="Search applications..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {isLoading && <div style={{ padding: 20 }}>Loading applications...</div>}
        {error && <div style={{ padding: 20, color: "red" }}>Error: {(error as Error).message}</div>}

        {!isLoading && !error && apps.map((a) => (
          <div key={a.id} className="item">
            <div>
              <div className="item-title">{a.studentName}</div>
              <div className="meta">
                {a.programName ?? "Unknown Program"} • {a.universityName ?? "Unknown Uni"} • {a.status}
              </div>
            </div>
            {/* Link to detail page (to be implemented) */}
            <button className="btn" onClick={() => alert(`Review application ${a.id}`)}>Review</button>
          </div>
        ))}

        {!isLoading && !error && apps.length === 0 && (
          <p className="hsub" style={{ marginTop: 12 }}>No applications found.</p>
        )}
      </div>
    </div>
  );
}
