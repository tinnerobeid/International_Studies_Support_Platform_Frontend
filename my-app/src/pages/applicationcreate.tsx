import { Link } from "react-router-dom";
import AdminLayout from "../components/admin/adminlayout";
import "./styles/admin_dashboard.css";

export default function AdminProgramCreatePage() {
  return (
    <AdminLayout
      title="Create Program"
      subtitle="Add a new program under a university."
      rightSlot={<Link className="ad-btn" to="/admin/programs">Back</Link>}
    >
      <div className="ad-card">
        <div className="ad-card-head">
          <div className="ad-card-title">Program Details</div>
        </div>

        <form style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Program Name</label>
            <input style={inputStyle} placeholder="Computer Science" />
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>University</label>
            <select style={inputStyle as any}>
              <option>Kyungdong University</option>
              <option>Korea University</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Level</label>
            <select style={inputStyle as any}>
              <option>Bachelors</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Description</label>
            <textarea style={{ ...inputStyle, height: 110 }} placeholder="Short program overview..." />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
            <button className="ad-btn primary" type="button">Create</button>
            <Link className="ad-btn" to="/admin/programs">Cancel</Link>
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
