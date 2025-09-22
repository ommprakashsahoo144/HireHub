import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import JobCard from "./JobCard";
import { fetchJobs } from "../api/mockApi";

export default function JobList({ jobs: initialJobs = [], onSelectJob, onApply }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loading, setLoading] = useState(!initialJobs.length);

  useEffect(() => {
    // Only fetch jobs if no initial jobs are provided
    if (!initialJobs.length) {
      fetchJobs().then(jobsData => {
        setJobs(jobsData);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [initialJobs]);

  const handleJobSelect = (job) => {
    if (onSelectJob) {
      onSelectJob(job);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-4">
          <p>Loading jobs...</p>
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
        {jobs.length === 0 && !loading && (
          <Col className="text-center">
            <p className="text-muted">No jobs found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}