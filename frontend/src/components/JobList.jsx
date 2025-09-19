import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import JobCard from "./JobCard";
import { fetchJobs } from "../api/mockApi";

export default function JobList({ jobs: initialJobs = [], onSelectJob, onApply }) {
  const [jobs, setJobs] = useState(initialJobs);

  useEffect(() => {
    if (!initialJobs.length) {
      fetchJobs().then(setJobs);
    }
  }, [initialJobs]);

  const handleJobSelect = (job) => {
    if (onSelectJob) {
      onSelectJob(job);
    }
  };

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