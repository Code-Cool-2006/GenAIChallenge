import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faMapMarkedAlt,
  faMicrophoneAlt,
  faFileAlt,
  faShareAlt,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

const CoreFeatures = () => {
  const features = [
    {
      icon: faChartLine,
      title: "Job Market Insights",
      description:
        "Get real-time data on salary, demand, and top skills for any career path with our AI-powered market analysis.",
      route: "/job-market",
    },
    {
      icon: faMapMarkedAlt,
      title: "AI Career Roadmap",
      description:
        "Receive personalized, step-by-step career plans tailored to your goals and current skill level.",
      route: "/career-roadmap",
    },
    {
      icon: faMicrophoneAlt,
      title: "Mock Interview Practice",
      description:
        "Practice interviews with AI and get instant feedback to improve your performance and confidence.",
      route: "/mock-interview",
    },
    {
      icon: faFileAlt,
      title: "Resume Optimization",
      description:
        "Transform your resume with AI-powered suggestions that match job requirements perfectly.",
      route: "/resume-builder",
    },
    {
      icon: faShareAlt,
      title: "Networking Assistant",
      description:
        "Generate personalized outreach messages for LinkedIn and email networking campaigns.",
      route: "#",
    },
    {
      icon: faUserTie,
      title: "AI Career Coach",
      description:
        "Get personalized career guidance and strategic advice powered by advanced AI algorithms.",
      route: "/chatbot",
    },
  ];

  return (
    <Container className="py-5 text-center">
      <h2 className="text-white fw-bold mb-2">
        Powerful AI Tools at Your Fingertips
      </h2>
      <p className="text-white-50 mb-5">
        Our comprehensive suite of AI-powered career tools will transform how
        you approach your professional growth
      </p>
      <Row className="g-4">
        {features.map((feature, index) => (
          <Col md={6} lg={4} key={index}>
            <Card
              className="h-100 p-4 border-0 text-start"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <div
                className="rounded d-inline-flex align-items-center justify-content-center bg-dark text-warning mb-3"
                style={{ width: "50px", height: "50px" }}
              >
                <FontAwesomeIcon icon={feature.icon} size="lg" />
              </div>
              <h3 className="text-white h5 fw-bold">{feature.title}</h3>
              <p className="text-white-50">{feature.description}</p>
              <Link to={feature.route} className="mt-auto text-warning">
                Learn More ➔
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CoreFeatures;
