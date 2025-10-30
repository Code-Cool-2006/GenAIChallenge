import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-text">Career</span>
          <span className="logo-text gradient">AI</span>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className="nav-right">
          <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/home" className="nav-links" onClick={closeMenu}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/resume-builder"
                className="nav-links"
                onClick={closeMenu}
              >
                Resume Builder
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/resume-analyze"
                className="nav-links"
                onClick={closeMenu}
              >
                Resume Analyzer
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/mock-interview"
                className="nav-links"
                onClick={closeMenu}
              >
                Mock Interview
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/career-roadmap"
                className="nav-links"
                onClick={closeMenu}
              >
                Career Roadmap
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/job-market" className="nav-links" onClick={closeMenu}>
                Job Market
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/chatbot" className="nav-links" onClick={closeMenu}>
                AI Assistant
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/about" className="nav-links" onClick={closeMenu}>
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/contact" className="nav-links" onClick={closeMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
