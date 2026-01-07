import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/applications.css";
import { loadNotifications, markAllRead, seedIfEmpty } from "../lib/appstore";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    seedIfEmpty();
    setNotifs(loadNotifications());
  }, []);

  function markRead() {
    markAllRead();
    setNotifs(loadNotifications());
  }

  return (
    <div className="app-wrap">
      <div className="hrow">
        <div>
          <h1 className="htitle">Notifications</h1>
          <p className="hsub">Deadline reminders and status updates.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={markRead} type="button">Mark all read</button>
          <Link className="btn" to="/applications">My Applications</Link>
        </div>
      </div>

      <div className="card">
        {notifs.length === 0 ? (
          <p className="hsub">No notifications yet.</p>
        ) : (
          notifs.map((n) => (
            <div key={n.id} className="item">
              <div>
                <div className="item-title">{n.title} {n.read ? "" : "•"}</div>
                <div className="meta">{new Date(n.createdAt).toLocaleString()}</div>
                <div style={{ marginTop: 6, color: "#374151", fontSize: 14 }}>{n.body}</div>
              </div>
              {!n.read && <span className="badge">New</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
