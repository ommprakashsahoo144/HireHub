import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CategoryIcon from "@mui/icons-material/Category";

export default function HeroSearch({ onSearch }) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q, location, jobType, category });
  };

  const handleClear = () => {
    setQ("");
    setLocation("");
    setJobType("");
    setCategory("");
    onSearch({ q: "", location: "", jobType: "", category: "" });
  };

  const popularSearches = [
    "Software Engineer", "Marketing Manager", "Sales Executive", 
    "HR Recruiter", "Data Analyst", "Graphic Designer", "Accountant"
  ];

  return (
    <section className="hero-search py-3" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="mb-3 text-center">Find Your Dream Job</h4>
          <Form onSubmit={submit}>
            <Row className="g-2">
              <Col md={3}>
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
              <Col md={2}>
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
              <Col md={2}>
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
              <Col md={2}>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: "white" }}>
                    <CategoryIcon fontSize="small" />
                  </InputGroup.Text>
                  <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="IT">IT & Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">Human Resources</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
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
          
          {/* Popular Searches */}
          <div className="mt-3">
            <small className="text-muted">Popular searches: </small>
            {popularSearches.map((search, index) => (
              <Button
                key={index}
                variant="link"
                size="sm"
                className="text-decoration-none p-0 ms-2"
                onClick={() => {
                  setQ(search);
                  setTimeout(() => submit({ preventDefault: () => {} }), 100);
                }}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}