import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import JobCard from "./JobCard";

export default function JobList({ jobs = [], onSelectJob, onApply }) {
  const handleJobSelect = (job) => {
    if (onSelectJob) {
      onSelectJob(job);
    }
  };

  if (!jobs.length) {
    return (
      <Container>
        <div className="text-center py-4">
          <p className="text-muted">No jobs found.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        {jobs.map((job) => (
          <Col md={6} lg={4} key={job.id} className="mb-4">
            <JobCard 
              job={job} 
              onSelectJob={() => handleJobSelect(job)} 
              onApply={() => onApply(job)} 
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}