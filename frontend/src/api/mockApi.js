import jobs from "../data/jobs";

export function fetchJobs(query = {}) {
  let out = jobs;
  
  // Search by keyword (title, company, tags, description)
  if (query.q) {
    const q = query.q.toLowerCase();
    out = out.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.tags && j.tags.some(tag => tag.toLowerCase().includes(q))) ||
      (j.description && j.description.toLowerCase().includes(q)) ||
      (j.category && j.category.toLowerCase().includes(q))
    );
  }
  
  // Enhanced location search
  if (query.location) {
    if (Array.isArray(query.location)) {
      const locationQueries = query.location.map(loc => loc.toLowerCase());
      out = out.filter(j => 
        j.location && locationQueries.some(locQuery => 
          j.location.toLowerCase().includes(locQuery)
        )
      );
    } else {
      const locationQuery = query.location.toLowerCase();
      out = out.filter(j => 
        j.location && j.location.toLowerCase().includes(locationQuery)
      );
    }
  }
  
  // Search by job type
  if (query.jobType) {
    out = out.filter(j => j.type === query.jobType);
  }
  
  // Search by category
  if (query.category) {
    const categoryQuery = query.category.toLowerCase();
    out = out.filter(j => 
      j.category && j.category.toLowerCase().includes(categoryQuery)
    );
  }
  
  return Promise.resolve(out);
}

export function fetchJobById(id) {
  return Promise.resolve(jobs.find(j => j.id === id));
}