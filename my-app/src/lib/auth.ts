import type { Role } from "../types/user";

const API_URL = "http://localhost:8000/api";
const KEY = "issp_token_v1";

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  created_at: string;
};

export type Session = {
  token: string;
  user: User | null;
};

// --- Auth State ---
export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(KEY);
}

export function logout() {
  localStorage.removeItem(KEY);
  window.location.href = "/login";
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getSession() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email: payload.sub,
      role: payload.role as Role
    };
  } catch {
    return null;
  }
}

// --- API Calls ---

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);


    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setToken(data.access_token);
    return true;
  } catch (e) {
    console.error("Login failed", e);
    return false;
  }
}

export async function signup(email: string, password: string, full_name: string, role: Role = "student"): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name, role }),
    });

    if (!res.ok) return false;
    // Auto login is not implemented in backend register, so user must login
    return true;
  } catch (e) {
    console.error("Signup failed", e);
    return false;
  }
}

export async function getMe(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) logout();
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

export async function getRole(): Promise<Role | null> {
  const user = await getMe(); // This is expensive to call repeatedly. 
  // Optimization: Decode token or cache user in context/storage. 
  // For now, let's just decode the token or use stored user if we had it.
  // The previous auth.ts was synchronous. This change breaks sync usage.
  // We should probably store the user info in localStorage too or accept async.
  return user?.role ?? null;
}