import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function ApplyModal({ show, onHide, job }) {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    mobile: "", 
    experience: "",
    resume: null 
  });
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    // Mock apply action
    setSubmitted(true);
    
    // Reset form after 2 seconds and close modal
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", mobile: "", experience: "", resume: null });
      onHide();
    }, 2000);
  };

  if (submitted) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center p-5">
          <div className="text-success mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h4>Application Submitted!</h4>
          <p className="text-muted">Your application for {job?.title} has been submitted successfully.</p>
          <Button variant="primary" onClick={onHide}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Apply for {job?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Full name</Form.Label>
            <Form.Control 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required
              placeholder="Enter your full name"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required
              placeholder="Enter your email"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control 
              type="tel" 
              value={form.mobile} 
              onChange={e => setForm({...form, mobile: e.target.value})} 
              required
              placeholder="Enter your mobile number"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Years of Experience</Form.Label>
            <Form.Select 
              value={form.experience} 
              onChange={e => setForm({...form, experience: e.target.value})} 
              required
            >
              <option value="">Select experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-8">5-8 years</option>
              <option value="8+">8+ years</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Resume (PDF)</Form.Label>
            <Form.Control 
              type="file" 
              accept=".pdf"
              onChange={e => setForm({...form, resume: e.target.files[0]})} 
              required
            />
            <Form.Text className="text-muted">
              Upload your resume in PDF format
            </Form.Text>
          </Form.Group>
          
          <Button type="submit" className="w-100" size="lg">
            Submit Application
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}