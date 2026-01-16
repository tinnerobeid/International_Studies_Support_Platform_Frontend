import { Navigate, useLocation } from "react-router-dom";
import { getRole, type Role } from "../lib/auth";

export default function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const role = getRole();
  const location = useLocation();

  // Not logged in -> send to login with next
  if (!role) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?as=student&next=${next}`} replace />;
  }

  // Wrong role -> redirect
  if (!allow.includes(role)) {
    return <Navigate to={role === "university" ? "/admin/dashboard" : "/profile"} replace />;
  }

  return <>{children}</>;
}
