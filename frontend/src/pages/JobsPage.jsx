import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import JobList from "../components/JobList";
import JobDetail from "../components/JobDetail";
import ApplyModal from "../components/ApplyModal";
import { fetchJobs } from "../api/mockApi";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all jobs when component mounts
  useEffect(() => {
    fetchJobs().then(jobs => {
      setAllJobs(jobs);
      setLoading(false);
    });
  }, []);

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

  if (loading) {
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
      {selectedJob ? (
        <JobDetail 
          job={selectedJob} 
          onBack={handleBackToList}
          onApply={() => handleApply(selectedJob)}
        />
      ) : (
        <>
          <h2 className="mb-4">All Jobs</h2>
          <JobList 
            jobs={allJobs}  // Pass all jobs explicitly
            onSelectJob={handleSelectJob} 
            onApply={handleApply} 
          />
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