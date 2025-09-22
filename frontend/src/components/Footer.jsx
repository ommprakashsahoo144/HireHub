// Footer.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0d47a1, #1976d2)",
        color: "white",
        padding: "2rem 0",
        marginTop: "2rem",
      }}
    >
      <Container>
        <Row>
          <Col md={4} sm={12} className="mb-3">
            <h5 className="fw-bold">HireHub</h5>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
              Your trusted platform to find the best jobs across industries and
              locations. Start your career journey with us today.
            </p>
          </Col>

          <Col md={4} sm={6} className="mb-3">
            <h6 className="fw-bold">Company</h6>
            <ul className="list-unstyled">
              <li><Link to="/career" className="text-white text-decoration-none">Career</Link></li>
              <li><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
              <li><Link to="/about" className="text-white text-decoration-none">About</Link></li>
            </ul>
          </Col>

          <Col md={4} sm={6} className="mb-3">
            <h6 className="fw-bold">Follow Us</h6>
            <p className="mb-0">🌐 Facebook</p>
            <p className="mb-0">🐦 Twitter</p>
            <p className="mb-0">💼 LinkedIn</p>
          </Col>
        </Row>
        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />
        <p className="text-center small mb-0">
          © {new Date().getFullYear()} HireHub. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
