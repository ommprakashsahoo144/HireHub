import React from "react";
import { Container } from "react-bootstrap";

export default function Career() {
  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #42a5f5, #1976d2)",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container className="text-center">
        <h1 className="fw-bold mb-3">Careers at HireHub</h1>
        <p className="lead mb-4">
          Join our passionate team and help build the future of job searching.
        </p>
        <p>
          We’re always looking for talented individuals in development, design,
          and operations. Be part of a culture that values growth, creativity,
          and teamwork.
        </p>
      </Container>
    </div>
  );
}
