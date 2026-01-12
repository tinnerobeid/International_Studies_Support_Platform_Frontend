import { Link, type LinkProps, useNavigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../lib/auth";

type Props = LinkProps & {
  require?: "student" | "university" | "any";
  toWhenAuthed?: string; // optional override
};

export default function ProtectedLink({
  require = "any",
  to,
  toWhenAuthed,
  ...rest
}: Props) {
  const nav = useNavigate();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const authed = isLoggedIn();
    const role = getRole();

    if (!authed) {
      e.preventDefault();
      const next = encodeURIComponent(String(to));
      // default student when coming from Apply/Account
      nav(`/login?as=student&next=${next}`);
      return;
    }

    if (require !== "any" && role !== require) {
      e.preventDefault();
      nav(role === "university" ? "/admin/dashboard" : "/profile");
      return;
    }

    if (toWhenAuthed) {
      e.preventDefault();
      nav(toWhenAuthed);
    }
  }

  return <Link to={to} {...rest} onClick={handleClick} />;
}
