import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute,
  faFileAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const StatsCard = () => {
  const stats = [
    { icon: faRoute, number: "500+", text: "Career Paths" },
    { icon: faFileAlt, number: "10K+", text: "Resumes Built" },
    { icon: faCheckCircle, number: "98%", text: "Interview Success" },
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center g-4">
        {stats.map((stat, index) => (
          <Col md={4} key={index}>
            <Card
              className="text-center p-4 border-0"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center bg-warning text-dark mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <FontAwesomeIcon icon={stat.icon} size="2x" />
              </div>
              <Card.Body>
                <h3 className="text-white fw-bold">{stat.number}</h3>
                <p className="text-white-50">{stat.text}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StatsCard;
