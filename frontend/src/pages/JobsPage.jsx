import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Badge, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CategoryIcon from "@mui/icons-material/Category";
import ClearIcon from "@mui/icons-material/Clear";
import JobList from "../components/JobList";
import JobDetail from "../components/JobDetail";
import ApplyModal from "../components/ApplyModal";
import { fetchJobs } from "../api/mockApi";

const INDIAN_LOCATIONS = [
  "Bangalore", "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", 
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh",
  "Gurgaon", "Gurugram", "Noida", "Remote", "Work From Home", "WFH"
];

const JOB_CATEGORIES = [
  "IT & Software", "Marketing", "Sales", "Healthcare", "Finance", 
  "HR", "Engineering", "Design", "Education", "Hospitality", "Legal"
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState({
    q: "",
    location: "",
    jobType: "",
    category: ""
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUserType = localStorage.getItem("userType");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    setIsAuthenticated(true);
    setUserType(savedUserType || 'jobseeker');
    
    if (savedUserType === 'recruiter') {
      navigate("/recruiter-dashboard");
      return;
    }
    
    fetchJobs().then(jobs => {
      setAllJobs(jobs);
      setFilteredJobs(jobs);
      setLoading(false);
    });
  }, [navigate]);

  const handleSearch = (filters = searchQuery) => {
    setLoading(true);
    setShowSuggestions(false);
    
    const query = {};
    if (filters.q) query.q = filters.q;
    
    if (filters.location) {
      const locations = filters.location.split(',')
        .map(loc => loc.trim())
        .filter(loc => loc.length > 0);
      
      if (locations.length > 0) {
        query.location = locations;
      }
    }
    
    if (filters.jobType) query.jobType = filters.jobType;
    if (filters.category) query.category = filters.category;

    fetchJobs(query).then(results => {
      const sortedResults = sortJobsByRelevance(results, filters);
      setFilteredJobs(sortedResults);
      setLoading(false);
    });
  };

  const sortJobsByRelevance = (jobs, filters) => {
    if (!filters.q && !filters.location && !filters.category) return jobs;

    return jobs.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Keyword matching score
      if (filters.q) {
        const q = filters.q.toLowerCase();
        
        if (a.title.toLowerCase().includes(q)) scoreA += 10;
        if (b.title.toLowerCase().includes(q)) scoreB += 10;
        
        if (a.title.toLowerCase() === q.toLowerCase()) scoreA += 5;
        if (b.title.toLowerCase() === q.toLowerCase()) scoreB += 5;
        
        if (a.company.toLowerCase().includes(q)) scoreA += 5;
        if (b.company.toLowerCase().includes(q)) scoreB += 5;
        
        if (a.tags && a.tags.some(tag => tag.toLowerCase().includes(q))) scoreA += 3;
        if (b.tags && b.tags.some(tag => tag.toLowerCase().includes(q))) scoreB += 3;
        
        if (a.description.toLowerCase().includes(q)) scoreA += 2;
        if (b.description.toLowerCase().includes(q)) scoreB += 2;
      }

      // Location matching
      if (filters.location) {
        const locations = filters.location.split(',')
          .map(loc => loc.trim().toLowerCase())
          .filter(loc => loc.length > 0);

        locations.forEach(loc => {
          const jobLocation = a.location.toLowerCase();
          if (jobLocation.includes(loc)) {
            if (jobLocation === loc) scoreA += 10;
            else scoreA += 8;
          }
          
          const jobLocationB = b.location.toLowerCase();
          if (jobLocationB.includes(loc)) {
            if (jobLocationB === loc) scoreB += 10;
            else scoreB += 8;
          }
        });
      }

      // Category matching
      if (filters.category) {
        if (a.category === filters.category) scoreA += 5;
        if (b.category === filters.category) scoreB += 5;
      }

      return scoreB - scoreA;
    });
  };

  const handleInputChange = (field, value) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'location' && value.length > 1) {
      const filteredSuggestions = INDIAN_LOCATIONS.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location) => {
    const currentLocations = searchQuery.location.split(',')
      .map(loc => loc.trim())
      .filter(loc => loc.length > 0);
    
    if (!currentLocations.includes(location)) {
      const newLocations = currentLocations.length > 0 
        ? [...currentLocations, location].join(', ')
        : location;
      
      setSearchQuery(prev => ({
        ...prev,
        location: newLocations
      }));
    }
    
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery({
      q: "",
      location: "",
      jobType: "",
      category: ""
    });
    setFilteredJobs(allJobs);
    setShowSuggestions(false);
  };

  const handleClearLocation = () => {
    setSearchQuery(prev => ({
      ...prev,
      location: ""
    }));
    setShowSuggestions(false);
  };

  const handleApply = (job) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedJob(job);
    setShowApply(true);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  const uniqueLocations = [...new Set(allJobs.map(job => job.location))].slice(0, 8);
  const uniqueCategories = [...new Set(allJobs.map(job => job.category))].filter(Boolean);

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Alert variant="info">
            Please login to access jobs
          </Alert>
        </div>
      </Container>
    );
  }

  if (loading && !filteredJobs.length) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <p>Loading jobs...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Search Section */}
      {!selectedJob && (
        <section className="mb-5">
          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="mb-3">Search Jobs in India</h4>
            <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <Row className="g-2">
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: "white" }}>
                      <SearchIcon fontSize="small" />
                    </InputGroup.Text>
                    <Form.Control 
                      placeholder="Job title, company, or keywords" 
                      value={searchQuery.q} 
                      onChange={e => handleInputChange('q', e.target.value)} 
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <div className="position-relative">
                    <InputGroup>
                      <InputGroup.Text style={{ backgroundColor: "white" }}>
                        <LocationOnIcon fontSize="small" />
                      </InputGroup.Text>
                      <Form.Control 
                        placeholder="Location" 
                        value={searchQuery.location} 
                        onChange={e => handleInputChange('location', e.target.value)}
                        onFocus={() => searchQuery.location.length > 1 && setShowSuggestions(true)}
                      />
                      {searchQuery.location && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={handleClearLocation}
                          style={{ border: 'none', background: 'transparent' }}
                        >
                          <ClearIcon fontSize="small" />
                        </Button>
                      )}
                    </InputGroup>
                    
                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="position-absolute w-100 bg-white border rounded mt-1 z-3">
                        {locationSuggestions.map((location, index) => (
                          <div
                            key={index}
                            className="p-2 border-bottom cursor-pointer hover-bg-light"
                            onClick={() => handleLocationSelect(location)}
                            style={{ cursor: 'pointer' }}
                          >
                            <small>{location}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={2}>
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: "white" }}>
                      <WorkOutlineIcon fontSize="small" />
                    </InputGroup.Text>
                    <Form.Select 
                      value={searchQuery.jobType} 
                      onChange={e => handleInputChange('jobType', e.target.value)}
                    >
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
                    <Form.Select 
                      value={searchQuery.category} 
                      onChange={e => handleInputChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {uniqueCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={1}>
                  <Button variant="primary" type="submit" className="w-100">
                    Search
                  </Button>
                </Col>
                <Col md={1}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClearSearch} 
                    className="w-100"
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
            
            {/* Quick Filters */}
            <Row className="mt-3">
              <Col md={6}>
                <small className="text-muted me-2">Popular locations:</small>
                {uniqueLocations.map((location, index) => (
                  <Badge
                    key={index}
                    bg="outline-primary"
                    text="primary"
                    className="me-2 mb-1 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSearchQuery(prev => ({ ...prev, location }));
                      setTimeout(() => handleSearch({ ...searchQuery, location }), 100);
                    }}
                  >
                    {location}
                  </Badge>
                ))}
              </Col>
              <Col md={6}>
                <small className="text-muted me-2">Categories:</small>
                {uniqueCategories.map((category, index) => (
                  <Badge
                    key={index}
                    bg="outline-success"
                    text="success"
                    className="me-2 mb-1 cursor-pointer"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSearchQuery(prev => ({ ...prev, category }));
                      setTimeout(() => handleSearch({ ...searchQuery, category }), 100);
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </Col>
            </Row>
          </div>
        </section>
      )}

      {/* Results Count */}
      {!selectedJob && filteredJobs.length > 0 && (
        <div className="mb-3">
          <h5>Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}</h5>
          {(searchQuery.q || searchQuery.location || searchQuery.jobType || searchQuery.category) && (
            <p className="text-muted">
              Showing results for: 
              {searchQuery.q && ` "${searchQuery.q}"`}
              {searchQuery.location && ` in ${searchQuery.location}`}
              {searchQuery.jobType && ` (${searchQuery.jobType})`}
              {searchQuery.category && ` [${searchQuery.category}]`}
            </p>
          )}
        </div>
      )}

      {/* Job List or Detail */}
      {selectedJob ? (
        <JobDetail 
          job={selectedJob} 
          onBack={handleBackToList}
          onApply={() => handleApply(selectedJob)}
        />
      ) : (
        <>
          {filteredJobs.length > 0 ? (
            <JobList 
              jobs={filteredJobs}
              onSelectJob={handleSelectJob} 
              onApply={handleApply} 
            />
          ) : (
            <div className="text-center py-5">
              <h5>No jobs found</h5>
              <p className="text-muted">
                Try adjusting your search criteria or 
                <Button 
                  variant="link" 
                  onClick={handleClearSearch}
                  className="p-0 ms-1"
                >
                  clear all filters
                </Button>
              </p>
            </div>
          )}
        </>
      )}
      
      <ApplyModal
        show={showApply}
        onHide={() => setShowApply(false)}
        job={selectedJob}
      />
    </Container>
  );
}