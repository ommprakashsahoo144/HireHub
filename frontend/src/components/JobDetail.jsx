import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Badge, Row, Col } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { fetchJobById } from "../api/mockApi";
import ApplyModal from "./ApplyModal";

export default function JobDetail({ job: propJob, onBack, onApply }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(propJob || null);
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    if (id && !propJob) {
      fetchJobById(id).then(setJob);
    }
  }, [id, propJob]);

  if (!job) return <Container className="py-5">Loading...</Container>;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleApplyClick = () => {
    if (onApply) {
      onApply();
    } else {
      setShowApply(true);
    }
  };

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        className="mb-4" 
        onClick={handleBack}
      >
        <ArrowBackIcon className="me-1" /> Back to Jobs
      </Button>

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <Row className="align-items-start">
          <Col md={8}>
            <h2 className="mb-2">{job.title}</h2>
            <div className="text-muted mb-3">{job.company} • {job.location}</div>
            
            <div className="d-flex flex-wrap gap-2 mb-4">
              <Badge bg="primary" className="px-3 py-2">{job.type}</Badge>
              {job.location.toLowerCase().includes('remote') && <Badge bg="success" className="px-3 py-2">Remote</Badge>}
              {job.level && <Badge bg="secondary" className="px-3 py-2">{job.level}</Badge>}
            </div>

            <div className="d-flex flex-wrap gap-1 mb-4">
              {job.tags?.map(t => (
                <Badge key={t} bg="light" text="dark" className="px-2 py-1 me-1">
                  {t}
                </Badge>
              ))}
            </div>
          </Col>
          
          <Col md={4} className="text-md-end">
            <div className="fw-bold text-primary fs-5 mb-2">{job.salary}</div>
            <div className="d-flex flex-md-column gap-2 justify-content-md-end">
              <Button variant="outline-secondary" className="me-2">
                <BookmarkBorderIcon fontSize="small" className="me-1" />
                Save
              </Button>
              <Button onClick={handleApplyClick} className="flex-grow-1">
                Apply Now
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        <Col md={8}>
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h5 className="mb-3">Job Description</h5>
            <p>{job.description}</p>
            
            <h6 className="mt-4">Requirements</h6>
            <ul>
              <li>5+ years of experience in software development</li>
              <li>Strong proficiency in JavaScript, including DOM manipulation</li>
              <li>Experience with popular React.js workflows (such as Flux or Redux)</li>
              <li>Familiarity with newer specifications of EcmaScript</li>
            </ul>
            
            <h6 className="mt-4">Benefits</h6>
            <ul>
              <li>Competitive salary and equity package</li>
              <li>Health, dental, and vision insurance</li>
              <li>Flexible working hours and remote work options</li>
              <li>Professional development budget</li>
            </ul>
          </div>
        </Col>
        
        <Col md={4}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h6 className="mb-3">Job Overview</h6>
            
            <div className="mb-3">
              <strong>Posted Date:</strong>
              <div className="text-muted">{job.postedAt}</div>
            </div>
            
            <div className="mb-3">
              <strong>Location:</strong>
              <div className="text-muted">{job.location}</div>
            </div>
            
            <div className="mb-3">
              <strong>Job Type:</strong>
              <div className="text-muted">{job.type}</div>
            </div>
            
            <div className="mb-3">
              <strong>Experience:</strong>
              <div className="text-muted">{job.level}</div>
            </div>
            
            <div className="mb-3">
              <strong>Salary:</strong>
              <div className="text-muted">{job.salary}</div>
            </div>
          </div>
        </Col>
      </Row>

      <ApplyModal show={showApply} onHide={() => setShowApply(false)} job={job} />
    </Container>
  );
}