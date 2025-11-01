import React, { useEffect, useRef, useState } from "react";
import "./CSS/home.css";

const Home = () => {
  const statsRef = useRef([]);
  const observerRef = useRef(null);
  const [hasSpoken, setHasSpoken] = useState(false);

  const speakIntro = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "hello Master your career with AI-powered resume building, market intelligence, interview prep, and personalized career guidance."
      );
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Optional: Set voice (use default if available)
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => voice.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  useEffect(() => {
    // Smooth scroll for navigation links
    const handleAnchorClick = (e) => {
      if (
        e.target.tagName === "A" &&
        e.target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Animate stats on scroll
    const stats = document.querySelectorAll(".stat-number");
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const finalValue = element.textContent;
            const numericValue = parseInt(finalValue);

            if (!isNaN(numericValue)) {
              let currentValue = 0;
              const increment = numericValue / 50;

              const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                  element.textContent = finalValue;
                  clearInterval(counter);
                } else {
                  element.textContent =
                    Math.floor(currentValue) +
                    (finalValue.includes("+")
                      ? "+"
                      : finalValue.includes("%")
                      ? "%"
                      : "");
                }
              }, 30);
            }
            statsObserver.unobserve(element);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach((stat) => statsObserver.observe(stat));

    // Fade in elements on scroll
    const elements = document.querySelectorAll(
      ".feature-card, .step, .testimonial-card"
    );
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "fadeIn 0.6s ease forwards";
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => fadeObserver.observe(element));

    // Smooth navbar background on scroll
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = "rgba(15, 23, 42, 0.98)";
          navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
        } else {
          navbar.style.background = "rgba(15, 23, 42, 0.95)";
          navbar.style.boxShadow = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Auto-speak intro when robot iframe loads (only once)
    const robotIframe = document.querySelector('.hero-visual iframe');
    if (robotIframe && !hasSpoken) {
      robotIframe.addEventListener('load', () => {
        // Small delay to ensure iframe is fully loaded
        setTimeout(() => {
          if (!hasSpoken) {
            speakIntro();
            setHasSpoken(true);
          }
        }, 1000);
      });
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("scroll", handleScroll);
      statsObserver.disconnect();
      fadeObserver.disconnect();
    };
  }, []);

  const handleCTAClick = () => {
    console.log("[v0] CTA button clicked");
    // Add your action here
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Your AI Career{" "}
              <span className="gradient-text">Transformation</span> Starts Here
            </h1>
            <p className="hero-subtitle">
              Master your career with AI-powered resume building, market
              intelligence, interview prep, and personalized career guidance.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={handleCTAClick}>
                Start Free Trial
              </button>
              <button className="btn btn-secondary" onClick={speakIntro}>
                🎤 Listen Intro
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Career Transformations</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <iframe
              src="https://my.spline.design/nexbotrobotcharacterconcept-JeEjS1E5IhW3mgDPpjUJ2cYF/"
              width="100%"
              height="100%"
              style={{ background: "transparent", border: "none" }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Powerful Features for Career Success</h2>
          <p>Everything you need to advance your career in one platform</p>
        </div>

        <div className="features-grid">
          {/* Feature 1: Resume Builder */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
              </svg>
            </div>
            <h3>AI Resume Builder</h3>
            <p>
              Create ATS-optimized resumes in minutes. Our AI analyzes job
              descriptions and tailors your resume for maximum impact.
            </p>
            <a href="#" className="feature-link">
              Explore →
            </a>
          </div>

          {/* Feature 2: Market Intelligence */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
                <polyline points="19 8 12 1 5 8"></polyline>
              </svg>
            </div>
            <h3>Market Intelligence</h3>
            <p>
              Get real-time insights on salary trends, in-demand skills, and
              industry growth. Stay ahead of the competition.
            </p>
            <a href="#" className="feature-link">
              Explore →
            </a>
          </div>

          {/* Feature 3: Interview Simulator */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3>Interview Simulator</h3>
            <p>
              Practice with AI-powered mock interviews. Get instant feedback on
              your answers and improve your confidence.
            </p>
            <a href="#" className="feature-link">
              Explore →
            </a>
          </div>

          {/* Feature 4: Career Chatbot */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <circle cx="9" cy="10" r="1"></circle>
                <circle cx="12" cy="10" r="1"></circle>
                <circle cx="15" cy="10" r="1"></circle>
              </svg>
            </div>
            <h3>Career Chatbot</h3>
            <p>
              Chat with our AI career advisor 24/7. Get personalized guidance on
              job search, career transitions, and growth.
            </p>
            <a href="#" className="feature-link">
              Explore →
            </a>
          </div>

          {/* Feature 5: Job Market Insights */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
                <path d="M1 12h6m6 0h6"></path>
                <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
              </svg>
            </div>
            <h3>Job Market Insights</h3>
            <p>
              Discover emerging opportunities and trending roles. Get alerts for
              jobs matching your profile and skills.
            </p>
            <a href="#" className="feature-link">
              Explore →
            </a>
          </div>

          {/* Feature 6: Skill Development */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>Skill Development</h3>
            <p>
              Personalized learning paths to master in-demand skills. Track your
              progress and showcase achievements.
            </p>
            <a href="#" className="feature-link">
              Explore →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How CareerAI Works</h2>
          <p>Three simple steps to transform your career</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Sign Up & Profile</h3>
            <p>
              Create your profile and let our AI understand your career goals
              and current skills.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>Get Personalized Plan</h3>
            <p>
              Receive a customized career roadmap with actionable steps tailored
              to your goals.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>Execute & Succeed</h3>
            <p>
              Use our tools to build resumes, ace interviews, and land your
              dream job.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2>Success Stories</h2>
          <p>Join thousands who've transformed their careers</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              "CareerAI helped me land my dream job at a top tech company. The
              resume builder and interview simulator were game-changers!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SA</div>
              <div>
                <div className="author-name">Sarah Anderson</div>
                <div className="author-role">Software Engineer at Google</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              "The market intelligence feature showed me exactly what skills I
              needed. Went from junior to senior role in 8 months!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MJ</div>
              <div>
                <div className="author-name">Michael Johnson</div>
                <div className="author-role">
                  Senior Product Manager at Meta
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              "The 24/7 career chatbot is like having a personal mentor. It
              answered all my questions and boosted my confidence!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">EP</div>
              <div>
                <div className="author-name">Emily Parker</div>
                <div className="author-role">UX Designer at Apple</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
