import { useEffect, useState } from "react";
import { getRole, setRole, type Role } from "../lib/role";

export default function RoleSwitcher() {
  const [role, setRoleState] = useState<Role>("student");

  useEffect(() => {
    setRoleState(getRole());
  }, []);

  function change(next: Role) {
    setRole(next);
    setRoleState(next);
    // simplest refresh so nav/layout updates everywhere
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "#6b7280" }}>Role:</span>

      <select
        value={role}
        onChange={(e) => change(e.target.value as Role)}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "8px 10px",
          fontSize: 14,
          background: "#fff",
        }}
      >
        <option value="student">Student</option>
        <option value="university">University</option>
      </select>
    </div>
  );
}
