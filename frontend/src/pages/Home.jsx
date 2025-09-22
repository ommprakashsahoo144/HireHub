import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import JobList from "../components/JobList";
import HeroSearch from "../components/HeroSearch";
import ApplyModal from "../components/ApplyModal";
import { fetchJobs } from "../api/mockApi";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(true);

  // Load initial jobs
  useEffect(() => {
    fetchJobs().then(jobs => {
      setFilteredJobs(jobs);
      setLoading(false);
    });
  }, []);

  const handleSearch = (filters) => {
    setLoading(true);
    
    // Prepare query for API with ALL filters
    const query = {};
    if (filters.q) query.q = filters.q;
    if (filters.location) query.location = filters.location;
    if (filters.jobType) query.jobType = filters.jobType;

    console.log("Search filters:", filters); // Debug log
    console.log("API query:", query); // Debug log

    fetchJobs(query).then(results => {
      console.log("Search results:", results); // Debug log
      setFilteredJobs(results);
      setDisplayCount(3);
      setLoading(false);
    });
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApply(true);
  };

  const handleViewAll = () => {
    setDisplayCount(prevCount => prevCount + 3);
  };

  const jobsToDisplay = filteredJobs.slice(0, displayCount);

  if (loading) {
    return <div className="text-center py-5">Loading jobs...</div>;
  }

  return (
    <div className="home-page" style={{ paddingBottom: '2rem' }}>
      {/* Hero Section */}
      <section 
        className="py-4"
        style={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white"
        }}
      >
        <Container>
          <Row className="align-items-center" style={{ minHeight: '60vh' }}>
            <Col md={6} className="text-center text-md-start">
              <h1 className="fw-bold mb-3" style={{ fontSize: "2.2rem" }}>
                Find Your Dream Job with <span style={{ color: "#ffd54f" }}>HireHub</span>
              </h1>
              <p className="lead mb-4" style={{ fontSize: "1.1rem" }}>
                Discover thousands of job opportunities from top companies worldwide. 
                Whether you're looking for remote work or onsite positions, we've got you covered.
              </p>
              <Button variant="light" size="lg" className="mb-4">
                Get Started
              </Button>
            </Col>
            <Col md={6} className="text-center d-none d-md-block">
              <img 
                src="https://cdn.pixabay.com/photo/2016/12/05/10/55/application-1883554_1280.jpg" 
                alt="Job Search" 
                className="img-fluid rounded shadow"
                style={{ maxHeight: "300px" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Section */}
      <HeroSearch onSearch={handleSearch} />

      {/* Featured Jobs Section */}
      <section className="py-4 bg-light">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-3">Featured Jobs</h2>
              <p className="text-muted text-center">
                Browse through our most recent job openings from top companies
              </p>
            </Col>
          </Row>
          
          <JobList 
            jobs={jobsToDisplay} 
            onSelectJob={setSelectedJob}
            onApply={handleApply}
          />
          
          {filteredJobs.length > displayCount && (
            <Row className="mt-4">
              <Col className="text-center">
                <Button variant="outline-primary" onClick={handleViewAll}>
                  View More Jobs
                </Button>
              </Col>
            </Row>
          )}
          
          {filteredJobs.length === 0 && !loading && (
            <Row className="mt-4">
              <Col className="text-center">
                <p className="text-muted">No jobs found matching your search criteria.</p>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    fetchJobs().then(jobs => {
                      setFilteredJobs(jobs);
                      setDisplayCount(3);
                    });
                  }}
                >
                  Show All Jobs
                </Button>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Stats Section */}
      <section
        className="py-4"
        style={{
          backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 90%)`,
          transition: "background-color 0.5s ease",
        }}
      >
        <Container>
          <Row>
            <Col xs={4} className="text-center mb-3">
              <WorkOutlineIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <h5 className="fw-bold">10,000+</h5>
              <p className="text-muted small">Jobs</p>
            </Col>
            <Col xs={4} className="text-center mb-3">
              <BusinessIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <h5 className="fw-bold">5,000+</h5>
              <p className="text-muted small">Companies</p>
            </Col>
            <Col xs={4} className="text-center mb-3">
              <PeopleAltIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <h5 className="fw-bold">50,000+</h5>
              <p className="text-muted small">Users</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Apply Modal */}
      <ApplyModal
        show={showApply}
        onHide={() => setShowApply(false)}
        job={selectedJob}
      />
    </div>
  );
}