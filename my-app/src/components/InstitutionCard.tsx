import React from 'react';
import { Institution } from '../types/institution';

interface InstitutionCardProps {
    institution: Institution;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution }) => {
    return (
        <article className="card institution-card">
            <div className="card-media">
                {institution.cover ? (
                    <img src={institution.cover} alt={`${institution.name} cover`} className="institution-cover" />
                ) : (
                    <div className="institution-cover-placeholder" style={{ backgroundColor: '#eee', height: '150px' }}></div>
                )}
                {institution.logo && (
                    <img src={institution.logo} alt={`${institution.name} logo`} className="institution-logo" />
                )}
            </div>
            <div className="card-body">
                <h3>{institution.name}</h3>
                <p className="institution-meta">
                    {institution.city}, {institution.region}
                </p>
                <div className="institution-tags">
                    <span className="tag">{institution.institution_type}</span>
                    <span className="tag">{institution.level}</span>
                </div>
                {institution.website && (
                    <a href={institution.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                        Visit Website
                    </a>
                )}
            </div>
        </article>
    );
};

export default InstitutionCard;
