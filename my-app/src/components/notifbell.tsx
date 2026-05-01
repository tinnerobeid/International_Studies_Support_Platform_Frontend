import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { seedIfEmpty, unreadCount } from "../lib/appStore";

export default function NotifBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    seedIfEmpty();
    setCount(unreadCount());

    const t = setInterval(() => setCount(unreadCount()), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <Link to="/notifications" style={{ textDecoration: "none" }}>
      <button className="btn" type="button" style={{ position: "relative" }}>
        🔔 Notifications
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: "#ef4444",
              color: "white",
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 12,
            }}
          >
            {count}
          </span>
        )}
      </button>
    </Link>
  );
}
