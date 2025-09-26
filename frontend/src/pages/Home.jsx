import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
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
  const [allJobs, setAllJobs] = useState([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Load initial jobs
  useEffect(() => {
    loadInitialJobs();
  }, []);

  const loadInitialJobs = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const jobs = await fetchJobs(filters);
      setFilteredJobs(jobs);
      if (Object.keys(filters).length === 0) {
        setAllJobs(jobs);
      }
      setLoading(false);
      
      if (jobs.length === 0 && Object.keys(filters).length > 0) {
        setError('No jobs found matching your search criteria.');
      } else if (jobs.length === 0) {
        setError('Unable to load jobs. Please check if the backend server is running.');
      }
    } catch (err) {
      setError('Error loading jobs: ' + err.message);
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setDisplayCount(6);
    
    const query = {};
    if (filters.q && filters.q.trim()) query.q = filters.q.trim();
    if (filters.location && filters.location.trim()) {
      query.location = filters.location.trim();
    }
    if (filters.jobType) query.jobType = filters.jobType;
    if (filters.category) query.category = filters.category;

    loadInitialJobs(query);
  };

  // Handle category click from Browse by Category section
  const handleCategorySearch = (category) => {
    const query = { category };
    setSearchFilters(query);
    setDisplayCount(6);
    loadInitialJobs(query);
  };

  // Handle popular search click
  const handlePopularSearch = (searchTerm) => {
    const query = { q: searchTerm };
    setSearchFilters(query);
    setDisplayCount(6);
    loadInitialJobs(query);
  };

  const handleApply = (job) => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    setSelectedJob(job);
    setShowApply(true);
  };

  const handleViewAll = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  const handleShowAllJobs = () => {
    setSearchFilters({});
    setDisplayCount(6);
    loadInitialJobs({});
  };

  const jobsToDisplay = filteredJobs.slice(0, displayCount);

  // Get unique categories and locations for quick filters
  const uniqueCategories = [...new Set(allJobs.map(job => job.category))].filter(Boolean);
  const uniqueLocations = [...new Set(allJobs.map(job => job.location))].slice(0, 10);

  if (loading && filteredJobs.length === 0) {
    return <div className="text-center py-5">Loading jobs...</div>;
  }

  return (
    <div className="home-page" style={{ paddingBottom: '2rem' }}>
      {/* Hero Section */}
      <section 
        className="py-2"
        style={{
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white"
        }}
      >
        <Container fluid="md">
          <Row className="align-items-center" style={{ minHeight: '20vh' }}>
            <Col md={6} className="text-center text-md-start">
              <h1 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>
                Find Your Dream Job with <span style={{ color: "#ffd54f" }}>HireHub</span>
              </h1>
              <p className="mb-3" style={{ fontSize: "0.9rem" }}>
                Discover thousands of job opportunities from top companies worldwide. 
                Search across all industries and locations.
              </p>
            </Col>
            <Col md={6} className="text-center d-none d-md-block">
              <img 
                src="https://cdn.pixabay.com/photo/2016/12/05/10/55/application-1883554_1280.jpg" 
                alt="Job Search" 
                className="img-fluid rounded shadow"
                style={{ maxHeight: "150px" }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Error Alert */}
      {error && (
        <Container className="mt-3">
          <Alert variant="warning" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Search Section */}
      <HeroSearch 
        onSearch={handleSearch} 
        onPopularSearch={handlePopularSearch} 
      />

      {/* Quick Categories */}
      <section className="py-3 bg-light">
        <Container>
          <Row>
            <Col>
              <h5 className="text-center mb-3">Browse by Category</h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {uniqueCategories.map(category => (
                  <Button 
                    key={category}
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleCategorySearch(category)}
                    className="mb-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Popular Locations */}
      <section className="py-3">
        <Container>
          <Row>
            <Col>
              <h5 className="text-center mb-3">Popular Locations</h5>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {uniqueLocations.map(location => (
                  <Button 
                    key={location}
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleSearch({ location })}
                    className="mb-2"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-4">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-2">
                {Object.keys(searchFilters).length > 0 ? 'Search Results' : 'Featured Jobs'}
              </h2>
              <p className="text-muted text-center">
                {Object.keys(searchFilters).length > 0 
                  ? `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} matching your search`
                  : 'Browse through our most recent job openings from top companies'
                }
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
                  onClick={handleShowAllJobs}
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
              <h5 className="fw-bold">{allJobs.length}+</h5>
              <p className="text-muted small">Jobs</p>
            </Col>
            <Col xs={4} className="text-center mb-3">
              <BusinessIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
              <h5 className="fw-bold">{[...new Set(allJobs.map(job => job.company))].length}+</h5>
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