import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/adminlayout";
import { useQuery } from "@tanstack/react-query";
import { fetchInstitutions, fetchPrograms } from "../services/api";
import "./styles/admin_dashboard.css";
import { useState } from "react";

export default function ApplicationCreatePage() {
  const [selectedUni, setSelectedUni] = useState("");
  const [selectedProg, setSelectedProg] = useState("");

  const { data: unis, isLoading: loadingUnis } = useQuery({
    queryKey: ["institutions"],
    queryFn: () => fetchInstitutions({ page_size: 100 }),
  });

  const { data: programs, isLoading: loadingProgs } = useQuery({
    queryKey: ["programs", selectedUni],
    queryFn: () => fetchPrograms(selectedUni),
    enabled: !!selectedUni,
  });

  return (
    <AdminLayout
      title="New Application"
      subtitle="Start a new application for a student."
      rightSlot={<Link className="ad-btn" to="/admin/applications">Back</Link>}
    >
      <div className="ad-card">
        <div className="ad-card-head">
          <div className="ad-card-title">Application Details</div>
        </div>

        <form style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Student Name (Simulated)</label>
            <input style={inputStyle} value="Christina Obeid" disabled />
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>University</label>
            <select
              style={inputStyle as any}
              value={selectedUni}
              onChange={(e) => { setSelectedUni(e.target.value); setSelectedProg(""); }}
            >
              <option value="">Select University...</option>
              {loadingUnis && <option>Loading...</option>}
              {unis?.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Program</label>
            <select
              style={inputStyle as any}
              value={selectedProg}
              onChange={(e) => setSelectedProg(e.target.value)}
              disabled={!selectedUni}
            >
              <option value="">Select Program...</option>
              {loadingProgs && <option>Loading...</option>}
              {programs?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <button className="ad-btn primary" type="button" disabled={!selectedProg}>Create Application</button>
            <Link className="ad-btn" to="/admin/applications">Cancel</Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e6e9f2",
  outline: "none",
  fontSize: 14,
  background: "#fff",
};
