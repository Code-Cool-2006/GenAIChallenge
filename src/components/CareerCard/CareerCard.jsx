import React from "react";
import { useNavigate } from "react-router-dom";

const CareerCard = () => {
  const navigate = useNavigate();

  // Inline styles for custom styling
  const styles = {
    careerHero: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f4c75 50%, #3282b8 75%, #0f4c75 100%)",
      position: "relative",
      overflow: "hidden",
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
    },
    heroTitle: {
      fontSize: "4rem",
      fontWeight: 700,
      color: "white",
      lineHeight: 1.1,
      marginBottom: "1.5rem",
    },
    heroTitleHighlight: {
      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    heroSubtitle: {
      fontSize: "1.5rem",
      color: "#cbd5e1",
      lineHeight: 1.6,
      marginBottom: "3rem",
      width: "400px",
    },
    btnPrimaryCustom: {
      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      border: "none",
      padding: "15px 35px",
      fontSize: "1.1rem",
      fontWeight: 600,
      borderRadius: "50px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 15px rgba(249, 115, 22, 0.3)",
      color: "white",
      cursor: "pointer",
    },
    btnOutlineCustom: {
      border: "2px solid #f97316",
      color: "#f97316",
      padding: "15px 35px",
      fontSize: "1.1rem",
      fontWeight: 600,
      borderRadius: "50px",
      background: "transparent",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    backgroundDecoration1: {
      position: "absolute",
      top: "-200px",
      right: "-200px",
      width: "400px",
      height: "400px",
      background:
        "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(40px)",
      zIndex: 1,
    },
    backgroundDecoration2: {
      position: "absolute",
      bottom: "-200px",
      left: "-200px",
      width: "400px",
      height: "400px",
      background:
        "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(40px)",
      zIndex: 1,
    },
    backgroundDecoration3: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "500px",
      height: "500px",
      background:
        "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      filter: "blur(60px)",
      zIndex: 1,
    },
  };

  // Media query styles for responsive design
  const mediaStyles = `
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem !important;
      }
      .hero-subtitle {
        font-size: 1.2rem !important;
      }
      .custom-btn {
        padding: 12px 25px !important;
        font-size: 1rem !important;
        margin-bottom: 15px;
      }
    }
    
    @media (max-width: 576px) {
      .hero-title {
        font-size: 2rem !important;
      }
      .hero-subtitle {
        font-size: 1.1rem !important;
      }
    }
  `;

  const handlePrimaryButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 8px 25px rgba(249, 115, 22, 0.4)";
      e.target.style.background =
        "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)";
    } else {
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 4px 15px rgba(249, 115, 22, 0.3)";
      e.target.style.background =
        "linear-gradient(135deg, #f97316 0%, #ea580c 100%)";
    }
  };

  const handleOutlineButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.background = "#f97316";
      e.target.style.color = "white";
      e.target.style.transform = "translateY(-2px)";
      e.target.style.boxShadow = "0 8px 25px rgba(249, 115, 22, 0.3)";
    } else {
      e.target.style.background = "transparent";
      e.target.style.color = "#f97316";
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "none";
    }
  };

  return (
    <>
      <style>{mediaStyles}</style>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div style={styles.careerHero} className="d-flex align-items-center">
        {/* Background Decorations */}
        <div style={styles.backgroundDecoration1}></div>
        <div style={styles.backgroundDecoration2}></div>
        <div style={styles.backgroundDecoration3}></div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div style={styles.heroContent} className="text-center">
                {/* Main Heading */}
                <h1 className="hero-title" style={styles.heroTitle}>
                  Supercharge Your
                  <br />
                  <span style={styles.heroTitleHighlight}>Career Journey</span>
                </h1>

                {/* Subtitle */}
                <p
                  className="hero-subtitle mx-auto"
                  style={styles.heroSubtitle}
                >
                  Unlock your potential with AI-powered career tools. From
                  resume optimization to interview practice, we'll help you land
                  your dream job with cutting-edge technology.
                </p>

                {/* Action Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                  <button
                    className="custom-btn"
                    style={styles.btnPrimaryCustom}
                    onMouseEnter={(e) => handlePrimaryButtonHover(e, true)}
                    onMouseLeave={(e) => handlePrimaryButtonHover(e, false)}
                    onClick={() => navigate("/resume-analyze")}
                  >
                    Start Your Journey →
                  </button>

                  <button
                    className="custom-btn"
                    style={styles.btnOutlineCustom}
                    onMouseEnter={(e) => handleOutlineButtonHover(e, true)}
                    onMouseLeave={(e) => handleOutlineButtonHover(e, false)}
                    onClick={() => navigate("/contact")}
                  >
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerCard;