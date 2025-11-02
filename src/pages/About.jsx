import React from "react";
import "./CSS/home.css";

function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              About <span className="gradient-text">CareerAI</span>
            </h1>
            <p className="hero-subtitle">
              We're on a mission to transform careers using the power of artificial intelligence. 
              Our platform empowers professionals to build better resumes, prepare for interviews, 
              and make data-driven career decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="features">
        <div className="section-header">
          <h2>Our Mission</h2>
          <p>Empowering careers through AI-driven innovation</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>Innovation First</h3>
            <p>
              We leverage cutting-edge AI technology to provide intelligent career 
              guidance and personalized recommendations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>User-Centric</h3>
            <p>
              Every feature is designed with our users in mind, ensuring an 
              intuitive and effective career development experience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Results Driven</h3>
            <p>
              Our platform has helped thousands of professionals land their dream 
              jobs and advance their careers successfully.
            </p>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>Our Core Values</h2>
          <p>The principles that guide everything we do</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Excellence</h3>
            <p>
              We strive for excellence in every aspect of our platform, from AI 
              accuracy to user experience.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>Integrity</h3>
            <p>
              We operate with transparency and honesty, building trust with our 
              users through reliable service.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>Impact</h3>
            <p>
              We measure our success by the positive impact we make on our users' 
              career journeys and lives.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2>Our Impact</h2>
          <p>Making a difference in careers worldwide</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="hero-stats" style={{ justifyContent: 'center' }}>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Users Worldwide</span>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Professionals trust CareerAI for their career development
            </p>
          </div>

          <div className="testimonial-card">
            <div className="hero-stats" style={{ justifyContent: 'center' }}>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Of our users report improved interview performance
            </p>
          </div>

          <div className="testimonial-card">
            <div className="hero-stats" style={{ justifyContent: 'center' }}>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              Always available to help you with career guidance
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
