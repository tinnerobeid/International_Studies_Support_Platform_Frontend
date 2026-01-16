import { programs, institutions } from "../data/mockData";

export interface Program {
  id: number;
  name: string;
  university_id: number;
  universityName?: string;
}

export async function fetchPrograms(universityId?: string): Promise<Program[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (universityId) {
    const uid = parseInt(universityId);
    return programs.filter(p => p.university_id === uid);
  }
  return programs;
}

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
  await new Promise((resolve) => setTimeout(resolve, 500));

  let results = institutions.map(i => ({
    ...i,
    // Ensure specific fields match what interface expects if needed
  }));

  if (params?.q) {
    results = results.filter(i => i.name.toLowerCase().includes(params.q!.toLowerCase()));
  }

  return results;
}