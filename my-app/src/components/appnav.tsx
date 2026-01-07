import { Link, useLocation } from "react-router-dom";
import { getRole } from "../lib/role";
import RoleSwitcher from "./RoleSwitcher";

export default function AppNav() {
  const role = getRole();
  const { pathname } = useLocation();

  const studentLinks = [
    { to: "/universities", label: "Universities" },
    { to: "/scholarships", label: "Scholarships" },
    { to: "/applications", label: "Applications" },
    { to: "/notifications", label: "Notifications" },
    { to: "/profile", label: "Profile" },
  ];

  const uniLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/applications", label: "Applications Review" },
    { to: "/admin/programs", label: "Programs" },
    { to: "/notifications", label: "Notifications" },
  ];

  const links = role === "student" ? studentLinks : uniLinks;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", fontWeight: 800 }}>
          Study Platform
        </Link>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                textDecoration: "none",
                fontSize: 14,
                padding: "8px 12px",
                borderRadius: 999,
                border: pathname === l.to ? "1px solid #c7d2fe" : "1px solid #e5e7eb",
                background: pathname === l.to ? "#eef2ff" : "#fff",
              }}
            >
              {l.label}
            </Link>
          ))}
          <RoleSwitcher />
        </div>
      </div>
    </div>
  );
}
