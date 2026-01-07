import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserRole, getCurrentUser } from "../lib/appstore";

type Props = {
  children: ReactNode;
  allow: UserRole[];
};

export default function RequireRole({ children, allow }: Props) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(user.role)) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Access Denied</h1>
        <p>You are logged in as <strong>{user.role}</strong>.</p>
        <p>This page requires one of: {allow.join(", ")}.</p>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          style={{ marginTop: 20, padding: "8px 16px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
