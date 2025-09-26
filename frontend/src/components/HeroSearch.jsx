import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card, Badge } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WhatshotIcon from "@mui/icons-material/Whatshot";

export default function HeroSearch({ onSearch, onPopularSearch }) {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [activePopularSearch, setActivePopularSearch] = useState("");

  // Auto-search when any filter changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (q || location || jobType || category) {
        submit();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [q, location, jobType, category]);

  const submit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    onSearch({ q, location, jobType, category });
  };

  const handleClear = () => {
    setQ("");
    setLocation("");
    setJobType("");
    setCategory("");
    setActivePopularSearch("");
    // Trigger search with empty filters immediately
    onSearch({ q: "", location: "", jobType: "", category: "" });
  };

  const handlePopularSearchClick = (searchTerm) => {
    setQ(searchTerm);
    setActivePopularSearch(searchTerm);
    // Don't need to call submit() here because useEffect will trigger it
  };

  const popularSearches = [
    { term: "Software Engineer", icon: "💻", trend: true },
    { term: "Marketing Manager", icon: "📊", trend: false },
    { term: "Sales Executive", icon: "💰", trend: true },
    { term: "HR Recruiter", icon: "👥", trend: false },
    { term: "Data Analyst", icon: "📈", trend: true },
    { term: "Graphic Designer", icon: "🎨", trend: false },
    { term: "Accountant", icon: "📋", trend: false },
    { term: "Remote Jobs", icon: "🏠", trend: true }
  ];

  return (
    <section className="hero-search py-3" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-3">
            <h5 className="mb-3 text-center fw-bold text-primary">Find Your Dream Job</h5>
            <Form onSubmit={submit}>
              <Row className="g-2">
                <Col xs={12} md={3} className="mb-2">
                  <InputGroup className="search-input-group">
                    <InputGroup.Text style={{ backgroundColor: "white", borderRight: "none" }}>
                      <SearchIcon fontSize="small" className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control 
                      placeholder="Job title, keywords, or company" 
                      value={q} 
                      onChange={e => setQ(e.target.value)}
                      className="border-left-0"
                      style={{ borderLeft: "none" }}
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} md={2} className="mb-2">
                  <InputGroup className="search-input-group">
                    <InputGroup.Text style={{ backgroundColor: "white", borderRight: "none" }}>
                      <LocationOnIcon fontSize="small" className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control 
                      placeholder="Location" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                      style={{ borderLeft: "none" }}
                    />
                  </InputGroup>
                </Col>
                <Col xs={12} md={2} className="mb-2">
                  <InputGroup className="search-input-group">
                    <InputGroup.Text style={{ backgroundColor: "white", borderRight: "none" }}>
                      <WorkOutlineIcon fontSize="small" className="text-primary" />
                    </InputGroup.Text>
                    <Form.Select 
                      value={jobType} 
                      onChange={e => setJobType(e.target.value)}
                      style={{ borderLeft: "none" }}
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
                <Col xs={12} md={2} className="mb-2">
                  <InputGroup className="search-input-group">
                    <InputGroup.Text style={{ backgroundColor: "white", borderRight: "none" }}>
                      <CategoryIcon fontSize="small" className="text-primary" />
                    </InputGroup.Text>
                    <Form.Select 
                      value={category} 
                      onChange={e => setCategory(e.target.value)}
                      style={{ borderLeft: "none" }}
                    >
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
                <Col xs={6} md={1} className="mb-2">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 fw-bold"
                    style={{ 
                      backgroundColor: "#1976d2", 
                      borderColor: "#1976d2", 
                      fontSize: "0.9rem",
                      transition: "all 0.3s ease"
                    }}
                  >
                    Search
                  </Button>
                </Col>
                <Col xs={6} md={1} className="mb-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleClear} 
                    className="w-100 py-2 fw-bold"
                    style={{ fontSize: "0.9rem", transition: "all 0.3s ease" }}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
            
            {/* Enhanced Popular Searches Section */}
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <WhatshotIcon className="text-warning me-2" fontSize="small" />
                <h6 className="text-muted mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>
                  Trending Job Searches
                </h6>
                <WhatshotIcon className="text-warning ms-2" fontSize="small" />
              </div>
              
              <div className="row g-2 justify-content-center">
                {popularSearches.map((search, index) => (
                  <div key={index} className="col-auto">
                    <Button
                      variant={activePopularSearch === search.term ? "warning" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3 py-2 d-flex align-items-center popular-search-btn"
                      onClick={() => handlePopularSearchClick(search.term)}
                      style={{ 
                        borderWidth: activePopularSearch === search.term ? "0" : "1px",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        fontSize: "0.85rem",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      <span className="me-2" style={{ fontSize: "1rem" }}>
                        {search.icon}
                      </span>
                      {search.term}
                      {search.trend && (
                        <Badge 
                          bg="danger" 
                          className="ms-2 trend-badge"
                          style={{ 
                            fontSize: "0.6rem",
                            animation: "pulse 2s infinite"
                          }}
                        >
                          Hot
                        </Badge>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Search Stats */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  <TrendingUpIcon fontSize="small" className="me-1" />
                  {popularSearches.length}+ popular searches today
                </small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      <style jsx>{`
        .search-input-group .form-control:focus,
        .search-input-group .form-select:focus {
          box-shadow: none;
          border-color: #1976d2;
        }
        
        .search-input-group .form-control,
        .search-input-group .form-select {
          border-radius: 0.375rem;
        }
        
        .popular-search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .popular-search-btn:active {
          transform: translateY(0);
        }
        
        .trend-badge {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .hero-search {
            padding: 1rem 0;
          }
          
          .card-body {
            padding: 1rem !important;
          }
          
          .btn {
            font-size: 0.8rem !important;
          }
          
          .popular-search-btn {
            font-size: 0.8rem !important;
            padding: 0.5rem 1rem !important;
          }
          
          .row.g-2 {
            margin: 0 -5px;
          }
          
          .col-auto {
            padding: 0 5px;
          }
        }
        
        @media (max-width: 576px) {
          .popular-search-btn {
            font-size: 0.75rem !important;
            padding: 0.4rem 0.8rem !important;
          }
          
          .popular-search-btn span {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </section>
  );
}