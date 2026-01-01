// Institution / university types and API function
export type Institution = {
  id: number;
  name: string;
  city: string;
  region: string;
  institution_type: string;
  level: string;
  sector?: string;
  website?: string | null;
  logo?: string | null;
  cover?: string | null;
  featured?: number | boolean;
  popular_score?: number;
  tuition_min?: number;
  tuition_max?: number;
};

export type InstitutionsResponse = {
  total: number;
  page: number;
  page_size: number;
  results: Institution[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function fetchInstitutions(params: Record<string, any>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    qs.set(k, String(v));
  });

  const url = `${API_BASE}/api/institutions?${qs.toString()}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`API error ${res.status}`);
  return await res.json();
}

// Scholarship types and API function
export type Scholarship = {
  id: number;
  name: string;
  provider: string;
  provider_type?: string | null;
  level: string;
  coverage: string;
  stipend?: number | null;
  eligibility?: string | null;
  deadline?: string | null;
  link?: string | null;
  popular_score?: number | null;
};

export async function fetchScholarships(params: {
  q?: string;
  provider?: string;
  level?: string;
  coverage?: string;
  eligibility?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";
  const url = new URL(`${API_BASE}/api/scholarships`);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<{ total: number; page: number; page_size: number; results: Scholarship[] }>;
}

