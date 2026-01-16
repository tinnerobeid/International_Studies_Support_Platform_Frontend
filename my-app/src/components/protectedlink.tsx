import { Link, type LinkProps, useNavigate } from "react-router-dom";
import { getRole, isLoggedIn, type Role } from "../lib/auth";

type Props = LinkProps & {
  require?: Role | "any";
};

export default function ProtectedLink({ require = "any", to, ...rest }: Props) {
  const nav = useNavigate();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const loggedIn = isLoggedIn();
    const role = getRole();

    if (!loggedIn) {
      e.preventDefault();
      const next = encodeURIComponent(String(to));
      nav(`/login?as=student&next=${next}`);
      return;
    }

    if (require !== "any" && role !== require) {
      e.preventDefault();
      nav(role === "university" ? "/admin/dashboard" : "/profile");
      return;
    }
  }

  return <Link to={to} {...rest} onClick={onClick} />;
}
