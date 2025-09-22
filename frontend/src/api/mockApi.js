import jobs from "../data/jobs";

export function fetchJobs(query = {}) {
  let out = jobs;
  
  // Search by keyword (title, company, tags)
  if (query.q) {
    const q = query.q.toLowerCase();
    out = out.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.tags && j.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }
  
  // Search by location
  if (query.location) {
    const locationQuery = query.location.toLowerCase();
    out = out.filter(j => 
      j.location && j.location.toLowerCase().includes(locationQuery)
    );
  }
  
  // Search by job type
  if (query.jobType) {
    out = out.filter(j => j.type === query.jobType);
  }
  
  return Promise.resolve(out);
}

export function fetchJobById(id) {
  return Promise.resolve(jobs.find(j => j.id === id));
}