import React from 'react';
import type { Institution } from '../types/institution';

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
                    <div className="institution-cover-placeholder" style={{ backgroundColor: '#222', height: '180px' }}></div>
                )}

                {institution.featured ? (
                    <div className="badge-featured">★ Featured</div>
                ) : null}

                <button className="favorite-icon" aria-label="Add to favorites">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21s-7.5-4.35-10-7.05C-0.5 11.1 2 6 6 6c2.5 0 3.5 2 6 4 2.5-2 3.5-4 6-4 4 0 6.5 5.1 4 7.95C19.5 16.65 12 21 12 21z" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {institution.logo && (
                    <div className="institution-logo-wrap">
                        <img src={institution.logo} alt={`${institution.name} logo`} className="institution-logo" />
                    </div>
                )}
            </div>

            <div className="card-body">
                <h3 className="institution-title">{institution.name}</h3>
                <p className="institution-meta">
                    {institution.city || "—"}, {institution.region || "—"}
                </p>
            </div>
        </article>
    );
};

export default InstitutionCard;
