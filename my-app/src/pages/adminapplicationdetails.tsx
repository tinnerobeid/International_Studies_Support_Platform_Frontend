import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./styles/applications.css";
import { getApplication, seedIfEmpty, updateApplication } from "../lib/appstore";
import type { AppStatus } from "../lib/appstore";

const STATUS_FLOW: AppStatus[] = ["Draft", "Submitted", "Under Review", "Interview", "Accepted", "Rejected"];

export default function AdminApplicationDetailPage() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    seedIfEmpty();
    if (!id) return;
    const a = getApplication(id);
    setApp(a);
    setAdminNotes(a?.adminNotes || "");
  }, [id]);

  if (!app) {
    return (
      <div className="app-wrap">
        <Link className="link" to="/admin/applications">← Back</Link>
        <div className="card">
          <h1 className="htitle">Application not found</h1>
        </div>
      </div>
    );
  }

  function setStatus(status: AppStatus) {
    const updated = updateApplication(app.id, { status });
    setApp(updated);
  }

  function saveNotes() {
    const updated = updateApplication(app.id, { adminNotes });
    setApp(updated);
    alert("Saved admin notes ✅");
  }

  return (
    <div className="app-wrap">
      <div className="navline">
        <Link className="link" to="/admin/applications">← Back to Admin List</Link>
        <Link className="btn" to={`/applications/${app.id}`}>View as Student</Link>
      </div>

      <div className="card">
        <h1 className="htitle">Review: {app.title}</h1>
        <p className="hsub">Student: {app.studentName}</p>

        <div>
          <span className="badge">{app.type}</span>
          <span className="badge">{app.status}</span>
          {app.deadline && <span className="badge">Deadline: {new Date(app.deadline).toLocaleDateString()}</span>}
        </div>

        <div className="actions" style={{ marginTop: 12 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Status</label>
          <select value={app.status} onChange={(e) => setStatus(e.target.value as AppStatus)}>
            {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="stepbar">
          {STATUS_FLOW.map((s) => {
            const cur = STATUS_FLOW.indexOf(app.status);
            const idx = STATUS_FLOW.indexOf(s);
            const cls = idx === cur ? "step active" : idx < cur ? "step done" : "step";
            return <span key={s} className={cls}>{s}</span>;
          })}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Student Snapshot</h2>
          <div className="kv"><h3>Name</h3><p>{app.studentName}</p></div>
          <div className="kv"><h3>Notes</h3><p>{app.notes || "—"}</p></div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Admin Notes</h2>
          <textarea rows={6} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} />
          <div className="actions">
            <button className="btn btn-primary" onClick={saveNotes} type="button">Save Notes</button>
            <button className="btn" onClick={() => alert("Later: request more info")} type="button">Request More Info</button>
          </div>
        </div>
      </div>
    </div>
  );
}
