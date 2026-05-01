import { Link, NavLink, useNavigate } from "react-router-dom";
import { getSession } from "../lib/auth";

export default function AppNav() {
  const nav = useNavigate();
  const session = getSession();

  const goLoginAsStudent = (nextPath: string) => {
    nav(`/login?as=student&next=${encodeURIComponent(nextPath)}`);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      goLoginAsStudent("/profile");
    }
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      goLoginAsStudent("/profile");
    }
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl">
          kstudy
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Home
          </NavLink>

          <NavLink to="/universities" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Universities
          </NavLink>

          <NavLink to="/scholarships" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Scholarships
          </NavLink>

          <NavLink to="/services" className={({ isActive }) => (isActive ? "font-semibold" : "")}>
            Services
          </NavLink>

          {/* ✅ Apply: if not logged in -> login -> profile */}
          <NavLink
            to="/profile"
            onClick={handleApplyClick}
            className={({ isActive }) => (isActive ? "font-semibold" : "")}
          >
            Apply
          </NavLink>

          {/* ✅ Account: if not logged in -> login */}
          <NavLink
            to="/profile"
            onClick={handleAccountClick}
            className={({ isActive }) => (isActive ? "font-semibold" : "")}
          >
            Account
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
