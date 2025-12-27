const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Institution {
  id: number;
  name: string;
  city: string;
  region: string;
  institution_type: string;
  level: string;
}

export async function fetchInstitutions(params?: {
  q?: string;
  region?: string;
  city?: string;
  institution_type?: string;
  level?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}): Promise<Institution[]> {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(
    `${API_BASE_URL}/api/institutions?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}