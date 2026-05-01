import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/applications.css";
import { loadApplications, seedIfEmpty } from "../lib/appstore";
import type { Application } from "../lib/appstore";

export default function ApplicationsListPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | "University" | "Scholarship">("All");
  const [status, setStatus] = useState<"All" | Application["status"]>("All");

  useEffect(() => {
    seedIfEmpty();
    setApps(loadApplications());
  }, []);

  const filtered = useMemo(() => {
    return apps.filter(a => {
      const matchesQ = a.title.toLowerCase().includes(q.toLowerCase());
      const matchesType = type === "All" ? true : a.type === type;
      const matchesStatus = status === "All" ? true : a.status === status;
      return matchesQ && matchesType && matchesStatus;
    });
  }, [apps, q, type, status]);

  return (
    <div className="app-wrap">
      <div className="hrow">
        <div>
          <h1 className="htitle">My Applications</h1>
          <p className="hsub">Track university and scholarship applications.</p>
        </div>

        <div className="actions">
          <Link className="btn btn-primary" to="/applications/new">+ New Application</Link>
        </div>
      </div>

      <div className="card">
        <div className="actions">
          <input className="field input" style={{ width: 320 }} placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="field select" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="All">All Types</option>
            <option value="University">University</option>
            <option value="Scholarship">Scholarship</option>
          </select>
          <select className="field select" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview">Interview</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="hsub" style={{ marginTop: 12 }}>No applications found.</p>
        ) : (
          filtered.map((a) => (
            <div key={a.id} className="item">
              <div>
                <div className="item-title">{a.title}</div>
                <div className="meta">
                  {a.type} • {a.status}{a.deadline ? ` • Deadline: ${new Date(a.deadline).toLocaleDateString()}` : ""}
                </div>
              </div>
              <Link className="btn" to={`/applications/${a.id}`}>Open</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
