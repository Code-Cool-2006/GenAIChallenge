// src/components/Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          {/* Left section */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Career AI</h5>
            <p className="small">
              Empowering your career journey with AI-driven tools for resumes,
              roadmaps, and interviews.
            </p>
            <p className="small mb-0">
              © {new Date().getFullYear()} Career AI. All rights reserved.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li>
                <a href="/" className="text-light text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="/resume" className="text-light text-decoration-none">
                  Resume Builder
                </a>
              </li>
              <li>
                <a href="/roadmap" className="text-light text-decoration-none">
                  Career Roadmap
                </a>
              </li>
              <li>
                <a
                  href="/interview"
                  className="text-light text-decoration-none"
                >
                  Mock Interview
                </a>
              </li>
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </Col>

          {/* Social Links */}
          <Col md={4}>
            <h6 className="fw-bold mb-3">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="https://linkedin.com" className="text-light fs-5">
                <FaLinkedin />
              </a>
              <a href="https://github.com" className="text-light fs-5">
                <FaGithub />
              </a>
              <a href="https://twitter.com" className="text-light fs-5">
                <FaTwitter />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
