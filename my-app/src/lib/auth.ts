export type Role = "student" | "university";

type Session = {
  email: string;
  role: Role;
};

const KEY = "issp_session_v1";

export function login(email: string, role: Role) {
  const session: Session = { email, role };
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.email) return null;
    if (parsed.role !== "student" && parsed.role !== "university") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getSession();
}

export function getRole(): Role | null {
  return getSession()?.role ?? null;
}
