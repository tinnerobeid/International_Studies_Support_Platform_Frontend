import { NavLink } from "react-router-dom";
import "../../pages/styles/admin_dashboard.css";

export default function AdminLayout({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="ad-shell">
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-logo">K+</div>
          <div>
            <div className="ad-brand-name">Admin</div>
            <div className="ad-brand-sub">Korea Platform</div>
          </div>
        </div>

        <nav className="ad-nav">
          <NavItem to="/admin/dashboard" label="Dashboard" />
          <NavItem to="/admin/programs" label="Programs" />
          <NavItem to="/admin/applications" label="Applications" />
          <NavItem to="/admin/universities" label="Universities" />
          <NavItem to="/admin/scholarships" label="Scholarships" />
          <NavItem to="/admin/settings" label="Settings" />
        </nav>

        <div className="ad-sidebar-footer">
          <button className="ad-btn ghost" type="button">Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ad-main">
        {/* Topbar */}
        <header className="ad-topbar">
          <div className="ad-top-left">
            <div className="ad-title">{title}</div>
            {subtitle && <div className="ad-subtitle">{subtitle}</div>}
          </div>

          <div className="ad-top-right">
            <div className="ad-search">
              <input placeholder="Search..." />
              <button type="button" aria-label="Search">🔎</button>
            </div>

            <button className="ad-iconbtn" type="button" title="Notifications">🔔</button>
            <div className="ad-avatar" title="Admin">A</div>

            {rightSlot}
          </div>
        </header>

        <div className="ad-content">{children}</div>
      </main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `ad-nav-item ${isActive ? "active" : ""}`}
      end={to === "/admin/dashboard"}
    >
      <span className="ad-nav-dot" />
      {label}
    </NavLink>
  );
}
