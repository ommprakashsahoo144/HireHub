import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

export default function HeroSearch({ onSearch }) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q, location, jobType });
  };

  const handleClear = () => {
    setQ("");
    setLocation("");
    setJobType("");
    onSearch({ q: "", location: "", jobType: "" });
  };

  return (
    <section className="hero-search py-4" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="mb-3 text-center">Find Your Dream Job</h4>
          <Form onSubmit={submit}>
            <Row className="g-2">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white" }}>
                    <SearchIcon fontSize="small" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Job title, keywords, or company" 
                    value={q} 
                    onChange={e => setQ(e.target.value)} 
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white" }}>
                    <LocationOnIcon fontSize="small" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Location" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white" }}>
                    <WorkOutlineIcon fontSize="small" />
                  </InputGroup.Text>
                  <Form.Select value={jobType} onChange={e => setJobType(e.target.value)}>
                    <option value="">All Job Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={1}>
                <Button variant="primary" type="submit" className="w-100">
                  Search
                </Button>
              </Col>
              <Col md={1}>
                <Button variant="outline-secondary" onClick={handleClear} className="w-100">
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </section>
  );
}