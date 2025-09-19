import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

export default function JobCard({ job, onSelectJob, onApply }) {
  const handleCardClick = (e) => {
    // Prevent click if the click was on a button or link
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && onSelectJob) {
      onSelectJob();
    }
  };

  return (
    <Card 
      className="mb-3 job-card border-0 shadow-sm" 
      style={{ borderRadius: '12px', cursor: onSelectJob ? 'pointer' : 'default' }}
      onClick={handleCardClick}
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div style={{ flex: 1 }}>
            <h6 className="mb-1 fw-bold text-dark">
              {job.title}
            </h6>
            <div className="text-muted small mb-2">{job.company} • {job.location}</div>
          </div>
          <Button variant="outline-secondary" size="sm" className="p-1">
            <BookmarkBorderIcon fontSize="small" />
          </Button>
        </div>

        <div className="d-flex flex-wrap gap-1 mb-2">
          <Badge bg="light" text="dark" className="px-2 py-1 small">
            {job.type}
          </Badge>
          {job.remote && (
            <Badge bg="light" text="dark" className="px-2 py-1 small">
              Remote
            </Badge>
          )}
          <Badge bg="light" text="dark" className="px-2 py-1 small">
            {job.level}
          </Badge>
        </div>

        <p className="text-truncate-2 text-muted small mb-2">
          {job.description}
        </p>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {job.tags?.slice(0, 3).map(t => (
            <Badge key={t} bg="secondary" className="me-1 px-2 py-1 small">
              {t}
            </Badge>
          ))}
          {job.tags?.length > 3 && (
            <Badge bg="light" text="dark" className="px-2 py-1 small">
              +{job.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-bold text-primary small">{job.salary}</div>
          <div>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                if (onApply) onApply(job);
              }}
              className="px-3"
            >
              Apply
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}