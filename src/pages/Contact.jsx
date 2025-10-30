import React, { useState } from "react";
import "./CSS/home.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="hero-subtitle">
              Have questions or feedback? We'd love to hear from you. Our team is 
              here to help you succeed in your career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="features">
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="section-header">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you shortly</p>
          </div>

          {submitted && (
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease'
            }}>
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            background: 'var(--dark-card)',
            border: '1px solid var(--dark-border)',
            padding: '2rem',
            borderRadius: '12px'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--dark-bg)',
                  border: '1px solid var(--dark-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--dark-bg)',
                  border: '1px solid var(--dark-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--dark-bg)',
                  border: '1px solid var(--dark-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--dark-bg)',
                  border: '1px solid var(--dark-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>Other Ways to Reach Us</h2>
          <p>Connect with us through various channels</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">📧</div>
            <h3>Email</h3>
            <p>support@careerai.com</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">💬</div>
            <h3>Chat</h3>
            <p>24/7 AI-powered support available</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">🌐</div>
            <h3>Social Media</h3>
            <p>Follow us for career tips and updates</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;