import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./styles/applications.css";
import { getApplication, seedIfEmpty, updateApplication } from "../lib/appstore";
import type { AppStatus } from "../lib/appstore";

const STATUS_FLOW: AppStatus[] = ["Draft", "Submitted", "Under Review", "Interview", "Accepted", "Rejected"];

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    seedIfEmpty();
    if (!id) return;
    setApp(getApplication(id));
  }, [id]);

  if (!app) {
    return (
      <div className="app-wrap">
        <Link className="link" to="/applications">← Back</Link>
        <div className="card">
          <h1 className="htitle">Application not found</h1>
          <p className="hsub">Go back to your applications list.</p>
        </div>
      </div>
    );
  }

  function setStatus(status: AppStatus) {
    const updated = updateApplication(app.id, { status });
    setApp(updated);
  }

  return (
    <div className="app-wrap">
      <div className="navline">
        <Link className="link" to="/applications">← Back to Applications</Link>
        <Link className="btn" to={`/admin/applications/${app.id}`}>View as Admin</Link>
      </div>

      <div className="card">
        <div className="hrow">
          <div>
            <h1 className="htitle">{app.title}</h1>
            <div className="meta">{app.type} • Created by {app.studentName}</div>
            <div>
              <span className="badge">{app.status}</span>
              {app.deadline && <span className="badge">Deadline: {new Date(app.deadline).toLocaleDateString()}</span>}
              {app.intake && <span className="badge">Intake: {app.intake}</span>}
            </div>
          </div>

          <div className="actions">
            <select value={app.status} onChange={(e) => setStatus(e.target.value as AppStatus)}>
              {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
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
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Checklist</h2>

          <div className="kv">
            <h3>Documents</h3>
            <p>Passport, Transcript, SOP, Recommendations</p>
          </div>

          <div className="kv">
            <h3>Next Actions</h3>
            <p>{app.notes || "Add notes to track what you need to do."}</p>
          </div>

          <div className="actions">
            <button className="btn" onClick={() => alert("Later: document uploads")}>Upload Documents</button>
            <button className="btn" onClick={() => alert("Later: reminders")}>Add Reminder</button>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Details</h2>
          <div className="kv"><h3>Type</h3><p>{app.type}</p></div>
          {app.programName && <div className="kv"><h3>Program</h3><p>{app.programName}</p></div>}
          {app.universityId && <div className="kv"><h3>University ID</h3><p>{app.universityId}</p></div>}
          {app.scholarshipId && <div className="kv"><h3>Scholarship ID</h3><p>{app.scholarshipId}</p></div>}
        </div>
      </div>
    </div>
  );
}
