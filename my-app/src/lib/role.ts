export type Role = "student" | "university";

const KEY = "issp_role_v1";

export function getRole(): Role {
  const raw = localStorage.getItem(KEY);
  if (raw === "student" || raw === "university") return raw;
  return "student"; // default
}

export function setRole(role: Role) {
  localStorage.setItem(KEY, role);
}

export function clearRole() {
  localStorage.removeItem(KEY);
}
