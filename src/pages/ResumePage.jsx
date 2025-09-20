// src/ResumePage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/resume.css";

export default function ResumePage() {
  const navigate = useNavigate();

  // Features expand/collapse
  const [openFeatureIdx, setOpenFeatureIdx] = useState(null);

  // Roadmap
  const careerData = useMemo(
    () => ({
      frontend: {
        title: "Frontend Developer",
        steps: [
          {
            title: "Foundation Skills",
            description: "HTML, CSS, JavaScript basics",
            progress: 85,
          },
          {
            title: "Framework Mastery",
            description: "React, Vue, or Angular",
            progress: 60,
          },
          {
            title: "Build Projects",
            description: "Portfolio-worthy applications",
            progress: 30,
          },
          {
            title: "Job Ready",
            description: "Interview prep & applications",
            progress: 0,
          },
        ],
      },
      data: {
        title: "Data Scientist",
        steps: [
          {
            title: "Math & Statistics",
            description: "Linear algebra, statistics, probability",
            progress: 70,
          },
          {
            title: "Programming Skills",
            description: "Python, R, SQL mastery",
            progress: 80,
          },
          {
            title: "Machine Learning",
            description: "Algorithms and model building",
            progress: 45,
          },
          {
            title: "Portfolio Projects",
            description: "Real-world data analysis",
            progress: 20,
          },
        ],
      },
      ux: {
        title: "UX Designer",
        steps: [
          {
            title: "Design Fundamentals",
            description: "Color theory, typography, layout",
            progress: 90,
          },
          {
            title: "UX Research",
            description: "User interviews, usability testing",
            progress: 65,
          },
          {
            title: "Design Tools",
            description: "Figma, Sketch, prototyping",
            progress: 75,
          },
          {
            title: "Portfolio Building",
            description: "Case studies and presentations",
            progress: 40,
          },
        ],
      },
      product: {
        title: "Product Manager",
        steps: [
          {
            title: "Business Fundamentals",
            description: "Strategy, market analysis, metrics",
            progress: 60,
          },
          {
            title: "Technical Skills",
            description: "Basic coding, APIs, databases",
            progress: 40,
          },
          {
            title: "Product Strategy",
            description: "Roadmapping, prioritization, OKRs",
            progress: 55,
          },
          {
            title: "Leadership Skills",
            description: "Team management, stakeholder communication",
            progress: 35,
          },
        ],
      },
    }),
    []
  );
  const [activeCareer, setActiveCareer] = useState("frontend");

  // Smooth-scroll for in-page links
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const onScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Card reveal animations on scroll
  useEffect(() => {
    const cards = document.querySelectorAll(
      ".feature-card, .tool-card, .testimonial-card"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    cards.forEach((c) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(30px)";
      c.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(c);
    });
    return () => observer.disconnect();
  }, []);

  // Stats animation when hero first appears
  const heroRef = useRef(null);
  useEffect(() => {
    const stats = heroRef.current?.querySelectorAll(".stat-number");
    if (!stats?.length) return;
    const targets = ["50K+", "95%", "500+"];

    const animateStats = () => {
      stats.forEach((stat, index) => {
        let current = 0;
        const target = parseInt(targets[index], 10);
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = targets[index];
            clearInterval(timer);
          } else {
            const suffix = targets[index].includes("%")
              ? "%"
              : targets[index].includes("K")
              ? "K+"
              : "+";
            stat.textContent = Math.floor(current) + suffix;
          }
        }, 50);
      });
    };

    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        animateStats();
        obs.disconnect();
      }
    });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  // Button click loading effect
  const withLoading = (fn) => (e) => {
    const btn = e.currentTarget;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      fn?.();
    }, 800);
  };

  const startResume = () => navigate("/resume-analyze");
  const generateRoadmap = () => navigate("/career-roadmap");
  const startInterview = () => navigate("/mock-interview");
  const findJobs = () => alert("🎯 Find matching jobs");
  const createPortfolio = () => alert("🌐 Generate portfolio");

  const careers = [
    { id: "frontend", label: "Frontend Developer", icon: "fab fa-react" },
    { id: "data", label: "Data Scientist", icon: "fas fa-chart-line" },
    { id: "ux", label: "UX Designer", icon: "fas fa-paint-brush" },
    { id: "product", label: "Product Manager", icon: "fas fa-lightbulb" },
  ];

  const features = [
    {
      icon: "fas fa-upload",
      title: "Smart Import",
      details: [
        "LinkedIn profile sync",
        "PDF parsing technology",
        "Manual input assistance",
      ],
    },
    {
      icon: "fas fa-brain",
      title: "AI Suggestions",
      details: [
        "Achievement optimization",
        "Action word suggestions",
        "Impact quantification",
      ],
    },
    {
      icon: "fas fa-palette",
      title: "Industry Templates",
      details: [
        "Tech-focused layouts",
        "Creative design templates",
        "Business professional formats",
      ],
    },
    {
      icon: "fas fa-search",
      title: "ATS Checker",
      details: [
        "ATS compatibility score",
        "Keyword optimization",
        "Format recommendations",
      ],
    },
    {
      icon: "fas fa-download",
      title: "Export Options",
      details: [
        "High-quality PDF export",
        "Editable DOCX format",
        "Portfolio website generator",
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section id="home" className="hero" ref={heroRef}>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Build Your Smart Resume & Career Roadmap with AI
            </h1>
            <p className="hero-subtitle">
              Transform your career journey with AI-powered resume building,
              personalized roadmaps, and intelligent job matching. Land your
              dream job faster than ever.
            </p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={withLoading(startResume)}
              >
                <i className="fas fa-file-alt"></i>
                Start Resume
              </button>
              <button
                className="btn btn-secondary btn-large"
                onClick={withLoading(generateRoadmap)}
              >
                <i className="fas fa-route"></i>
                Generate Roadmap
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Resumes Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Companies</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="resume-preview">
              <div className="resume-header"></div>
              <div className="resume-content">
                <div className="resume-line"></div>
                <div className="resume-line short"></div>
                <div className="resume-line"></div>
                <div className="resume-line medium"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Resume Builder Features</h2>
            <p>
              Everything you need to create a standout resume that gets noticed
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, idx) => {
              const expanded = openFeatureIdx === idx;
              return (
                <div
                  key={f.title}
                  className={`feature-card ${expanded ? "expanded" : ""}`}
                  onClick={() => setOpenFeatureIdx(expanded ? null : idx)}
                >
                  <div className="feature-icon">
                    <i className={f.icon}></i>
                  </div>
                  <h3>{f.title}</h3>
                  <p>Click to see details.</p>
                  <div className="feature-details">
                    <ul>
                      {f.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="roadmap">
        <div className="container">
          <div className="section-header">
            <h2>AI-Powered Career Roadmap</h2>
            <p>
              Get a personalized step-by-step plan to reach your career goals
            </p>
          </div>

          <div className="roadmap-demo">
            <div className="career-selector">
              <h3>Select Your Career Goal</h3>
              <div className="career-options">
                {careers.map((c) => (
                  <button
                    key={c.id}
                    className={`career-btn ${
                      activeCareer === c.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCareer(c.id)}
                  >
                    <i className={c.icon}></i>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="roadmap-timeline">
              {careerData[activeCareer].steps.map((step, i) => (
                <div
                  className={`timeline-item ${
                    step.progress > 0 ? "active" : ""
                  }`}
                  key={step.title}
                >
                  <div className="timeline-marker">{i + 1}</div>
                  <div className="timeline-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {step.progress > 0
                        ? `${step.progress}% Complete`
                        : "Not Started"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="tools">
        <div className="container">
          <div className="section-header">
            <h2>Complete Career Toolkit</h2>
            <p>Everything you need to land your dream job</p>
          </div>

          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <h3>AI Interview Practice</h3>
              <p>
                Practice with our AI interviewer for both HR and technical
                questions.
              </p>
              <button
                className="btn btn-outline"
                onClick={withLoading(startInterview)}
              >
                Start Practice
              </button>
            </div>

            <div className="tool-card">
              <div className="tool-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3>Job Matching</h3>
              <p>Find jobs that match your skills and experience.</p>
              <button
                className="btn btn-outline"
                onClick={withLoading(findJobs)}
              >
                Find Jobs
              </button>
            </div>

            <div className="tool-card">
              <div className="tool-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>Portfolio Generator</h3>
              <p>
                Automatically generate a professional portfolio website from
                your resume data.
              </p>
              <button
                className="btn btn-outline"
                onClick={withLoading(createPortfolio)}
              >
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>See how Resume AI helped others land their dream jobs</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "Resume AI helped me land a frontend developer role at Google.
                  The AI suggestions made my achievements sound so much more
                  impactful!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Sarah Chen"
                  />
                </div>
                <div className="author-info">
                  <h4>Sarah Chen</h4>
                  <p>Frontend Developer at Google</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "The career roadmap feature was a game-changer. It gave me a
                  clear path from student to data scientist, and I followed it
                  step by step."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Marcus Johnson"
                  />
                </div>
                <div className="author-info">
                  <h4>Marcus Johnson</h4>
                  <p>Data Scientist at Netflix</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "I went from 0 interviews to 5 job offers in 2 months. The ATS
                  optimization feature made all the difference in getting past
                  initial screenings."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img
                    src="/placeholder.svg?height=50&width=50"
                    alt="Emily Rodriguez"
                  />
                </div>
                <div className="author-info">
                  <h4>Emily Rodriguez</h4>
                  <p>UX Designer at Airbnb</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
