import AdminLayout from "../components/admin/adminlayout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of platform activity"
    >
      {/* Stats cards */}
      <div className="ad-stats">
        <div className="ad-stat">
          <div className="k">128</div>
          <div className="l">Total Applications</div>
        </div>

        <div className="ad-stat">
          <div className="k">42</div>
          <div className="l">Universities</div>
        </div>

        <div className="ad-stat">
          <div className="k">76</div>
          <div className="l">Programs</div>
        </div>

        <div className="ad-stat">
          <div className="k">19</div>
          <div className="l">Scholarships</div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="ad-card">
        <div className="ad-card-head">
          <div className="ad-card-title">Recent Applications</div>
        </div>

        <table className="ad-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Application</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr className="ad-row">
              <td>Christina Obeid</td>
              <td>KDU – Computer Science</td>
              <td><span className="ad-pill green">Submitted</span></td>
              <td>2026-01-06</td>
            </tr>

            <tr className="ad-row">
              <td>John Doe</td>
              <td>GKS Scholarship</td>
              <td><span className="ad-pill yellow">Under Review</span></td>
              <td>2026-01-05</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
