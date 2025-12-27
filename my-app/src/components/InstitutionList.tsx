import React, { useEffect, useState } from 'react';
import { Institution } from '../types/institution';
import InstitutionCard from './InstitutionCard';

const InstitutionList: React.FC = () => {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await fetch('/api/institutions');
                if (!response.ok) {
                    throw new Error('Failed to fetch institutions');
                }
                const data = await response.json();
                setInstitutions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutions();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading universities...</div>; // Simple loading state
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    return (
        <section className="cards">
            <div className="container cards-grid">
                {institutions.map((inst) => (
                    <InstitutionCard key={inst.id} institution={inst} />
                ))}
            </div>
        </section>
    );
};

export default InstitutionList;
