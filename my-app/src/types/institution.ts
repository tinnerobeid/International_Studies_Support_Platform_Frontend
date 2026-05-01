export interface Institution {
    id: number;
    name: string;
    city: string | null;
    region: string | null;
    institution_type: string | null; // Public / Private
    level: string | null; // Undergraduate / Graduate / Both
    sector?: string;
    website?: string;
    logo?: string;
    cover?: string;
    featured: boolean;
    popular_score: number;
}
