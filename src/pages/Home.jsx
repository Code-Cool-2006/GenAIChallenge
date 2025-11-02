import React, { useEffect } from 'react';
import '../App.css'; // This links the CSS file

const App = () => {
  // All JavaScript logic is moved into this useEffect hook.
  // It runs once when the component mounts.
  useEffect(() => {
    // --- Helper Functions from your <script> tag ---

    // Smooth navigation scroll behavior
    const smoothScrollHandler = function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // Smooth navbar blur effect that increases on scroll
    const navbarScrollHandler = () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;
      const scrollPercent = window.scrollY / window.innerHeight;
      const blurAmount = Math.min(scrollPercent * 20, 20);

      navbar.style.background = `rgba(10, 14, 39, ${
        0.85 + scrollPercent * 0.15
      })`;
      navbar.style.backdropFilter = `blur(${10 + blurAmount}px)`;
      navbar.style.boxShadow = `0 ${4 + blurAmount}px ${20 + blurAmount}px rgba(0, 212, 255, ${
        0.1 + scrollPercent * 0.2
      })`;
    };

    // Mouse-tracking glow effect in hero section
    const heroMouseHandler = (e) => {
      const heroContent = document.querySelector(".hero-content");
      if (!heroContent) return;

      const rect = heroContent.getBoundingClientRect();
      
      // Check if mouse is over the hero section
      if (rect.top < e.clientY && rect.bottom > e.clientY && rect.left < e.clientX && rect.right > e.clientX) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // We can't directly style the ::before pseudo-element.
        // The original CSS :hover::before handles the opacity.
        // We need to set CSS variables for position if we want to track it.
        // Let's modify the original logic to use CSS variables.
        heroContent.style.setProperty("--mouse-x", `${x}px`);
        heroContent.style.setProperty("--mouse-y", `${y}px`);
      }
    };

    // Feature cards with 3D tilt effect
    const cardMousemoveHandler = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    };

    const cardMouseleaveHandler = (e) => {
      const card = e.currentTarget;
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
    };

    // Animated stat counters
    const animateStats = () => {
      const stats = document.querySelectorAll(".stat-number");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const finalValue = element.textContent;
              const numericValue = Number.parseInt(finalValue);

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
                      (finalValue.includes("+") ? "+" : finalValue.includes("%") ? "%" : "");
                  }
                }, 30);
              }
              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.5 }
      );

      stats.forEach((stat) => observer.observe(stat));
    };

    // Fade in elements on scroll
    const fadeInOnScroll = () => {
      const elements = document.querySelectorAll(
        ".feature-card, .step, .testimonial-card"
      );
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach((element) => observer.observe(element));
    };
    
    // Scroll-based navigation highlighting
    const navHighlightHandler = () => {
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll(".nav-links a");
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
            link.classList.add("active");
            }
        });
    };

    const updateNavigation = () => {
      window.addEventListener("scroll", navHighlightHandler);
    };

    // Button ripple effect
    const rippleClickHandler = (e) => {
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      // Add ripple styles dynamically
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.background = 'rgba(255, 255, 255, 0.3)';

      button.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    };

    // Create scroll progress bar
    let progressBar;
    const scrollProgressHandler = () => {
        if (!progressBar) return;
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + "%";
    };

    const createScrollProgress = () => {
      progressBar = document.createElement("div");
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #0066ff);
        z-index: 1001;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
      window.addEventListener("scroll", scrollProgressHandler);
    };

    // Create interactive particle system
    const createParticles = () => {
      const container = document.getElementById("particlesContainer");
      if (!container) return;

      const sizes = ["small", "medium", "large"];
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        particle.className = `particle ${size}`;
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDuration = Math.random() * 4 + 5 + "s";
        particle.style.animationDelay = Math.random() * 3 + "s";
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        container.appendChild(particle);
      }
    };
    
    // --- Attach Listeners & Run Init Functions ---
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
        anchor.addEventListener("click", smoothScrollHandler);
    });

    window.addEventListener("scroll", navbarScrollHandler);
    document.addEventListener("mousemove", heroMouseHandler);

    const cards = document.querySelectorAll(".feature-card");
    cards.forEach((card) => {
        card.addEventListener("mousemove", cardMousemoveHandler);
        card.addEventListener("mouseleave", cardMouseleaveHandler);
    });

    const buttons = document.querySelectorAll(".btn-primary, .cta-button");
    buttons.forEach((button) => {
        button.addEventListener("click", rippleClickHandler);
    });

    animateStats();
    fadeInOnScroll();
    updateNavigation();
    createScrollProgress();
    createParticles();

    // --- Cleanup Function ---
    // This runs when the component unmounts
    return () => {
        anchors.forEach((anchor) => {
            anchor.removeEventListener("click", smoothScrollHandler);
        });

        window.removeEventListener("scroll", navbarScrollHandler);
        document.removeEventListener("mousemove", heroMouseHandler);

        cards.forEach((card) => {
            card.removeEventListener("mousemove", cardMousemoveHandler);
            card.removeEventListener("mouseleave", cardMouseleaveHandler);
        });
        
        buttons.forEach((button) => {
            button.removeEventListener("click", rippleClickHandler);
        });

        window.removeEventListener("scroll", navHighlightHandler);
        window.removeEventListener("scroll", scrollProgressHandler);

        if (progressBar && progressBar.parentNode) {
            progressBar.parentNode.removeChild(progressBar);
        }
    };
  }, []); // Empty dependency array means this runs only once

  return (
    <>
      {/* --- HTML Body Content converted to JSX --- */}
      <div className="wave-animation">
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
        <div className="wave-layer"></div>
      </div>
      <div className="particles" id="particlesContainer"></div>

    

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              The Next-Gen <span className="gradient-text">AI Agent</span> Economy
            </h1>
            <p className="hero-subtitle">
              Orchestrate Multiple AI Agents To Gather Insights, Take Action, And
              Earn Rewards Autonomously.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-secondary">Watch Demo</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Agents</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Autonomous</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <iframe
              src="https://my.spline.design/nexbotrobotcharacterconcept-JeEjS1E5IhW3mgDPpjUJ2cYF/"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by">
        <h2>Trusted By Individuals And Teams From</h2>
        <div className="trusted-logos">
          <div className="logo-item">OpenAI</div>
          <div className="logo-item">Google</div>
          <div className="logo-item">Meta</div>
          <div className="logo-item">Microsoft</div>
          <div className="logo-item">Anthropic</div>
          <div className="logo-item">DeepMind</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Powerful Features for AI Orchestration</h2>
          <p>Everything you need to manage autonomous AI agents</p>
        </div>

        <div className="features-grid">
          {/* Feature 1: Agent Management */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
              </svg>
            </div>
            <h3>Agent Management</h3>
            <p>
              Create, deploy, and manage multiple AI agents. Monitor their
              performance and optimize their behavior in real-time.
            </p>
            <a href="#" className="feature-link">
              Learn more →
            </a>
          </div>

          {/* Feature 2: Multi-Agent Orchestration */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
                <polyline points="19 8 12 1 5 8"></polyline>
              </svg>
            </div>
            <h3>Multi-Agent Orchestration</h3>
            <p>
              Coordinate multiple agents to work together seamlessly. Enable
              complex workflows and autonomous decision-making.
            </p>
            <a href="#" className="feature-link">
              Learn more →
            </a>
          </div>

          {/* Feature 3: Real-Time Monitoring */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3>Real-Time Monitoring</h3>
            <p>
              Track agent activities, performance metrics, and system health. Get
              instant alerts for anomalies and issues.
            </p>
            <a href="#" className="feature-link">
              Learn more →
            </a>
          </div>

          {/* Feature 4: Autonomous Execution */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <circle cx="9" cy="10" r="1"></circle>
                <circle cx="12" cy="10" r="1"></circle>
                <circle cx="15" cy="10" r="1"></circle>
              </svg>
            </div>
            <h3>Autonomous Execution</h3>
            <p>
              Let agents execute tasks independently. Set rules and watch them
              take action without manual intervention.
            </p>
            <a href="#" className="feature-link">
              Learn more →
            </a>
          </div>

          {/* Feature 5: Reward System */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
                <path d="M1 12h6m6 0h6"></path>
                <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
              </svg>
            </div>
            <h3>Reward System</h3>
            <p>
              Incentivize agent performance with dynamic rewards. Track earnings
              and optimize ROI across your agent network.
            </p>
            <a href="#" className="feature-link">
              Learn more →
            </a>
          </div>

          {/* Feature 6: Advanced Analytics */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>Advanced Analytics</h3>
            <p>
              Deep insights into agent behavior and performance. Predictive
              analytics to optimize your AI economy.
            </p>
            <a href="#" className="feature-link">
              Learn more →
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How AI Agent Economy Works</h2>
          <p>Three simple steps to orchestrate your AI agents</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Create Agents</h3>
            <p>
              Define agent behaviors, goals, and constraints. Configure them for
              your specific use case.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>Deploy & Monitor</h3>
            <p>
              Launch your agents and monitor their performance in real-time with
              advanced analytics.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>Earn & Optimize</h3>
            <p>
              Collect rewards and continuously optimize your agent network for
              maximum efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="pricing"> {/* Added id="pricing" to match nav */}
        <div className="section-header">
          <h2>Success Stories</h2>
          <p>Join thousands who've transformed their business with AI agents</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              "The AI Agent Economy platform revolutionized how we automate our
              workflows. Incredible ROI in just 3 months!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JD</div>
              <div>
                <div className="author-name">John Davis</div>
                <div className="author-role">CTO at TechCorp</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              "Managing multiple AI agents has never been easier. The
              orchestration features are game-changing for our operations."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SL</div>
              <div>
                <div className="author-name">Sarah Lee</div>
                <div className="author-role">
                  Operations Director at InnovateLabs
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>
              "The real-time monitoring and analytics gave us complete
              visibility into our AI operations. Highly recommended!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MC</div>
              <div>
                <div className="author-name">Marcus Chen</div>
                <div className="author-role">AI Lead at FutureTech</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact"> {/* Added id="contact" to match nav */}
        <h2>Ready to Build Your AI Agent Economy?</h2>
        <p>
          Join leading companies automating their operations with intelligent
          agents
        </p>
        <button className="btn btn-primary btn-large">
          Start Your Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>AI Agents</h4>
            <p>Orchestrating the future of autonomous AI</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Security</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 AI Agent Economy. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default App;
