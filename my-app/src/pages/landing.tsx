import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleApplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle "Apply Now" submit
    // e.g. call API, show message, etc.
    console.log("Apply form submitted");
  };

  const handleFooterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle footer newsletter submit
    console.log("Footer form submitted");
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="/" aria-label="kstudy home">
            <span>kstudy</span>
          </a>

          <button
            className="hamburger"
            id="hamburger"
            aria-label="Toggle menu"
            aria-expanded="false"
            aria-controls="site-nav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className="nav" id="site-nav" aria-label="Primary">
            <ul>
              <li>
                <a href="#top">Home</a>
              </li>
              <li>
                <a href="#services">Universities</a>
              </li>
              <li>
                <a href="#services">Scholarships</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#join">Apply</a>
              </li>
              <li className="nav-user">
                <Link to="/login" aria-label="Account">
                  <i className="fa-solid fa-user" />
                  <span className="nav-user__label">Account</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <span className="hero-overlay" aria-hidden="true"></span>

          <div className="container hero-content">
            <h1>Explore Your Academic Future in Korea</h1>
            <p>
              Discover universities, scholarships, and visa assistance all in
              one place.
            </p>
            <a className="btn btn-outline" href="#join">
              Apply Now
            </a>
          </div>
        </section>

        <section className="cards">
          <div className="container cards-grid">
            <article className="card">
              <h3>University Information</h3>
              <p>
                Explore comprehensive university information across Korea that
                includes courses, program offerings, rankings, tuition fees,
                admission requirements, and application timelines—all in one
                place. Compare degrees and language tracks, check deadlines, and
                follow official links so you can plan your next step with
                confidence.
              </p>
            </article>

            <article className="card">
              <h3>Scholarships</h3>
              <p>
                Government and university scholarships in Korea provide
                international students with financial assistance and academic
                support to pursue higher education. These scholarships generally
                cover tuition fees, living expenses, and other essential costs,
                allowing students to focus on their studies without financial
                burden.
              </p>
            </article>

            <article className="card">
              <h3>Visa Support</h3>
              <p>
                Students receive clear instructions on how to meet specific visa
                requirements, avoid common mistakes, and ensure a smooth and
                timely approval process. By offering reliable guidance tailored
                to each country’s regulations, visa support helps students focus
                on their academic journey with confidence and peace of mind.
              </p>
            </article>
          </div>
        </section>

        <section className="about">
          <div className="container about-grid">
            <div className="about-text">
              <h2>Your Study Abroad Companion</h2>
              <p>
                Kstudy serves as a bridge between students and educational
                opportunities in Korea, offering an easier and more organized
                way to find and apply to universities and scholarships. The
                platform streamlines every stage of the application process,
                from discovering programs and understanding requirements to
                preparing necessary documents to ensuring students can apply
                with clarity and confidence.
              </p>
              <a href="#join" className="btn btn-outline">
                Join Us Now
              </a>
            </div>
            <div className="about-image">
              <img
                src="/images/img1.png"
                alt="Students studying in a modern Korean university"
              />
            </div>
          </div>
        </section>

        <section className="edu-section" id="ally">
          <div className="edu-container">
            <div className="edu-media">
              <img
                src="/images/img2.jpeg"
                alt="University campus"
                className="edu-img back"
              />
              <img
                src="/images/img3.jpeg"
                alt="Advisor assisting a student"
                className="edu-img front"
              />
            </div>

            <div className="edu-copy">
              <h2 className="edu-title">
                Your Educational
                <br />
                Ally
              </h2>
              <p className="edu-text">
                Our platform provides a wide range of personalized resources
                designed to support every step of your academic journey. From
                detailed visa assistance to structured TOPIK preparation, we
                ensure that students are fully equipped to meet both academic
                and administrative requirements. Each service is carefully
                tailored to individual needs, helping learners overcome
                challenges, adapt to new environments, and confidently pursue
                their studies in Korea with the right tools and guidance.
              </p>
            </div>
          </div>
        </section>

        <section className="hero-dark" id="explore">
          <div className="hero-content">
            <h1 className="hero-title">Explore Your Future</h1>
            <p className="hero-subtitle">
              Discover universities and scholarships in Korea with Kstudy.
            </p>
          </div>
        </section>

        <section className="services" id="services">
          <div className="container">
            <div className="services-grid">
              <article className="service-card">
                <div className="service-media">
                  <img
                    src="/images/uni.jpeg"
                    alt="Students studying in a library"
                  />
                </div>
                <div className="service-body">
                  <h3>University Information</h3>
                  <p>
                    Gain complete and reliable information about universities,
                    programs, and application processes all in one convenient
                    place to help you make informed decisions about your
                    education.
                  </p>
                </div>
              </article>

              <article className="service-card">
                <div className="service-media">
                  <img
                    src="/images/scholar.jpeg"
                    alt="Scholarship application form"
                  />
                </div>
                <div className="service-body">
                  <h3>Scholarship Assistance</h3>
                  <p>
                    Discover scholarships that align with your academic goals
                    and study plans, offering financial support and opportunities
                    that help you focus on achieving success throughout your
                    educational journey.
                  </p>
                </div>
              </article>

              <article className="service-card">
                <div className="service-media">
                  <img
                    src="/images/visa.jpeg"
                    alt="Graduate adjusting cap"
                  />
                </div>
                <div className="service-body">
                  <h3>Visa Support</h3>
                  <p>
                    Receive expert guidance with your visa applications and
                    pre-arrival preparations, ensuring a smooth transition into
                    studying abroad with all the necessary documents and
                    requirements ready on time.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="cta-join" id="join">
          <div className="container">
            <h2 className="cta-join__title">Join Our Academic Community</h2>
            <p className="cta-join__subtitle">
              Explore Universities and Scholarships in Korea
            </p>

            <form
              id="applyForm"
              className="cta-join__form"
              noValidate
              onSubmit={handleApplySubmit}
            >
              <label htmlFor="joinEmail" className="cta-join__label">
                Your Email Address
              </label>
              <input
                type="email"
                id="joinEmail"
                name="email"
                className="cta-join__input"
                placeholder="Enter your email here"
                required
                inputMode="email"
                autoComplete="email"
                aria-describedby="joinHelp"
              />
              <small id="joinHelp" className="cta-join__help"></small>

              <button type="submit" className="cta-join__btn">
                Apply Now
              </button>
              <p
                className="cta-join__msg"
                id="joinMsg"
                role="status"
                aria-live="polite"
              ></p>
            </form>
          </div>
        </section>

        <section className="testimonial" id="testimonial">
          <div className="testimonial-container">
            <div className="testimonial-stars" aria-label="5 stars">
              ★★★★★
            </div>
            <p className="testimonial-text">
              Kstudy made my university application process seamless and
              stress-free. Their guidance on scholarships and visa applications
              was invaluable. Highly recommend their services!
            </p>
            <div className="testimonial-author">
              {/* <img src="user.jpg" alt="Reviewer photo" /> */}
            </div>
            <div className="testimonial-author">
              <h4>Jane Doe</h4>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3 className="footer-title">Connect</h3>
            <p className="footer-text">
              Discover universities and scholarships in Korea.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" aria-label="TikTok">
                <i className="fab fa-tiktok" />
              </a>
              <a href="#" aria-label="X / Twitter">
                <i className="fab fa-x-twitter" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Support</h3>
            <p className="footer-text">+82-10-1234-5678</p>
            <p className="footer-text">info@kstudyplatform.com</p>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Community</h3>
            <form className="footer-form" onSubmit={handleFooterSubmit}>
              <label htmlFor="footer-email">Your Email Address</label>
              <input
                type="email"
                id="footer-email"
                placeholder="Enter your email here"
                required
              />
              <button type="submit">Join the Kstudy Community</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © <span>{currentYear}</span> Kstudy. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Landing;
