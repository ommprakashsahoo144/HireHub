import React, { useState } from "react";
import { Container } from "react-bootstrap";
import JobList from "../components/JobList";
import JobDetail from "../components/JobDetail";
import ApplyModal from "../components/ApplyModal";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApply, setShowApply] = useState(false);

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
          <JobList onSelectJob={handleSelectJob} onApply={handleApply} />
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