import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function About() {
  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4">
            <h1 className="fw-bold mb-3">About HireHub</h1>
            <p>
              HireHub is a modern job-searching platform designed to connect
              talent with opportunity. We simplify the process of finding jobs
              and empower individuals to achieve their career goals.
            </p>
            <p>
              Our mission is to create a platform that benefits both job seekers
              and employers by fostering trust, transparency, and innovation.
            </p>
          </Col>
          <Col md={6}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Team"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
