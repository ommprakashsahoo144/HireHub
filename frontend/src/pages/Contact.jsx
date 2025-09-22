import React from "react";
import { Container, Form, Button } from "react-bootstrap";

export default function Contact() {
  return (
    <div
      style={{
        minHeight: "80vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <h1 className="fw-bold text-center mb-4">Contact Us</h1>
        <Form
          className="shadow p-4 rounded"
          style={{ maxWidth: "600px", margin: "0 auto", background: "white" }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Write your message" />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Send Message
          </Button>
        </Form>
      </Container>
    </div>
  );
}
