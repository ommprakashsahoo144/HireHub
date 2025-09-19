import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer style={{ background: "#222", color: "#ccc", padding: "40px 0" }}>
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5 style={{ color: "#fff" }}>HireHub</h5>
            <p>Connecting job seekers with top companies worldwide.</p>
          </Col>
          <Col md={2} className="mb-3">
            <h6 style={{ color: "#fff" }}>Company</h6>
            <ul className="list-unstyled">
              <li><a href="/" style={{ color: "#ccc", textDecoration: "none" }}>About</a></li>
              <li><a href="/" style={{ color: "#ccc", textDecoration: "none" }}>Careers</a></li>
              <li><a href="/" style={{ color: "#ccc", textDecoration: "none" }}>Contact</a></li>
            </ul>
          </Col>
          <Col md={2} className="mb-3">
            <h6 style={{ color: "#fff" }}>Support</h6>
            <ul className="list-unstyled">
              <li><a href="/" style={{ color: "#ccc", textDecoration: "none" }}>Help Center</a></li>
              <li><a href="/" style={{ color: "#ccc", textDecoration: "none" }}>FAQs</a></li>
              <li><a href="/" style={{ color: "#ccc", textDecoration: "none" }}>Privacy Policy</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3 text-md-end text-center">
            <p className="mb-1">&copy; {new Date().getFullYear()} HireHub. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
