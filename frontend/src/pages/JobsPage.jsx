import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Badge } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ClearIcon from "@mui/icons-material/Clear";
import JobList from "../components/JobList";
import JobDetail from "../components/JobDetail";
import ApplyModal from "../components/ApplyModal";
import { fetchJobs } from "../api/mockApi";

// Common Indian locations for suggestions
const INDIAN_LOCATIONS = [
  "Bangalore", "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", 
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh",
  "Gurgaon", "Gurugram", "Noida", "Remote", "Work From Home", "WFH"
];

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState({
    q: "",
    location: "",
    jobType: ""
  });

  // Location suggestions
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load all jobs when component mounts
  useEffect(() => {
    fetchJobs().then(jobs => {
      setAllJobs(jobs);
      setFilteredJobs(jobs);
      setLoading(false);
    });
  }, []);

  const handleSearch = (filters = searchQuery) => {
    setLoading(true);
    setShowSuggestions(false);
    
    // Prepare query for API with ALL filters
    const query = {};
    if (filters.q) query.q = filters.q;
    
    // Enhanced location handling for multiple Indian locations
    if (filters.location) {
      // Split by comma and clean up the locations
      const locations = filters.location.split(',')
        .map(loc => loc.trim())
        .filter(loc => loc.length > 0);
      
      if (locations.length > 0) {
        query.location = locations;
      }
    }
    
    if (filters.jobType) query.jobType = filters.jobType;

    console.log("Search filters:", filters);
    console.log("API query with Indian locations:", query);

    fetchJobs(query).then(results => {
      console.log("Search results:", results);
      
      // Sort results: exact matches first, then others
      const sortedResults = sortJobsByRelevance(results, filters);
      
      setFilteredJobs(sortedResults);
      setLoading(false);
    });
  };

  // Function to sort jobs by relevance for Indian locations
  const sortJobsByRelevance = (jobs, filters) => {
    if (!filters.q && !filters.location) return jobs;

    return jobs.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Keyword matching score
      if (filters.q) {
        const q = filters.q.toLowerCase();
        
        // Title match (highest priority)
        if (a.title.toLowerCase().includes(q)) scoreA += 10;
        if (b.title.toLowerCase().includes(q)) scoreB += 10;
        
        // Exact title match (even higher priority)
        if (a.title.toLowerCase() === q.toLowerCase()) scoreA += 5;
        if (b.title.toLowerCase() === q.toLowerCase()) scoreB += 5;
        
        // Company match
        if (a.company.toLowerCase().includes(q)) scoreA += 5;
        if (b.company.toLowerCase().includes(q)) scoreB += 5;
        
        // Tags match
        if (a.tags && a.tags.some(tag => tag.toLowerCase().includes(q))) scoreA += 3;
        if (b.tags && b.tags.some(tag => tag.toLowerCase().includes(q))) scoreB += 3;
      }

      // Location matching score for Indian locations
      if (filters.location) {
        const locations = filters.location.split(',')
          .map(loc => loc.trim().toLowerCase())
          .filter(loc => loc.length > 0);

        locations.forEach(loc => {
          const jobLocation = a.location.toLowerCase();
          if (jobLocation.includes(loc)) {
            // Exact location match gets higher score
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

      return scoreB - scoreA; // Higher scores first
    });
  };

  const handleInputChange = (field, value) => {
    setSearchQuery(prev => ({
      ...prev,
      [field]: value
    }));

    // Show location suggestions when user types in location field
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
    
    // Add the selected location if not already present
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
      jobType: ""
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
    setSelectedJob(job);
    setShowApply(true);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  // Get unique locations from all jobs for quick filters
  const uniqueLocations = [...new Set(allJobs.map(job => job.location))].slice(0, 8);

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
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: "white" }}>
                      <SearchIcon fontSize="small" />
                    </InputGroup.Text>
                    <Form.Control 
                      placeholder="e.g., Backend Engineer, React Developer" 
                      value={searchQuery.q} 
                      onChange={e => handleInputChange('q', e.target.value)} 
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <div className="position-relative">
                    <InputGroup>
                      <InputGroup.Text style={{ backgroundColor: "white" }}>
                        <LocationOnIcon fontSize="small" />
                      </InputGroup.Text>
                      <Form.Control 
                        placeholder="e.g., Bangalore, Remote, Mumbai" 
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
                    
                    {/* Location Suggestions */}
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
                  <small className="text-muted">Use commas for multiple locations</small>
                </Col>
                <Col md={3}>
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
            
            {/* Popular Indian Locations Quick Filters */}
            <div className="mt-3">
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
            </div>
          </div>
        </section>
      )}

      {/* Results Count */}
      {!selectedJob && filteredJobs.length > 0 && (
        <div className="mb-3">
          <h5>Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} in India</h5>
          {(searchQuery.q || searchQuery.location || searchQuery.jobType) && (
            <p className="text-muted">
              Showing results for: 
              {searchQuery.q && ` "${searchQuery.q}"`}
              {searchQuery.location && ` in ${searchQuery.location}`}
              {searchQuery.jobType && ` (${searchQuery.jobType})`}
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
              <h5>No jobs found in India</h5>
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