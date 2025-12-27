import React from 'react';
import InstitutionList from '../components/InstitutionList';
import { Link } from 'react-router-dom';

const UniversitiesPage: React.FC = () => {
    return (
        <div className="universities-page">
            <header className="site-header">
                <div className="container header-inner">
                    <Link className="logo" to="/" aria-label="kstudy home">
                        <span>kstudy</span>
                    </Link>
                    <nav className="nav" aria-label="Primary">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/universities" className="active">Universities</Link></li>
                            <li><Link to="/scholarships">Scholarships</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero-dark">
                    <div className="hero-content">
                        <h1>Universities in South Korea</h1>
                        <p>Explore top institutions for your studies.</p>
                    </div>
                </section>

                <InstitutionList />
            </main>

            <footer className="footer">
                <div className="footer-container">
                    <p>© {new Date().getFullYear()} Kstudy.</p>
                </div>
            </footer>
        </div>
    );
};

export default UniversitiesPage;
