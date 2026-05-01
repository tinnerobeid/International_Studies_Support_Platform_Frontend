import { institutions, scholarships } from "../data/mockData";

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

export async function fetchInstitutions(params: Record<string, any>) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter mock data based on params (simple implementation)
  let results = institutions.filter(inst => {
    if (params.q && !inst.name.toLowerCase().includes(params.q.toLowerCase())) return false;

    if (params.region && params.region !== "All" && inst.region !== params.region) return false;
    if (params.city && params.city !== "All" && inst.city !== params.city) return false;
    if (params.institution_type && params.institution_type !== "All" && inst.institution_type !== params.institution_type) return false;
    if (params.level && params.level !== "All" && inst.level !== params.level && inst.level !== "Both") return false;

    return true;
  });

  return {
    total: results.length,
    page: params.page || 1,
    page_size: params.page_size || 10,
    results: results,
  };
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
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let results = scholarships.filter(sch => {
    if (params.q && !sch.name.toLowerCase().includes(params.q.toLowerCase())) return false;
    if (params.provider && params.provider !== "All" && !sch.provider.toLowerCase().includes(params.provider.toLowerCase())) return false;
    if (params.level && params.level !== "All" && sch.level !== params.level && sch.level !== "Both") return false;
    if (params.coverage && params.coverage !== "All" && sch.coverage !== params.coverage) return false;

    return true;
  });

  return {
    total: results.length,
    page: params.page || 1,
    page_size: params.page_size || 10,
    results: results
  } as { total: number; page: number; page_size: number; results: Scholarship[] };
}
