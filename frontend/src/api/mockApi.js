import jobs from "../data/jobs";

export function fetchJobs(query = {}) {
  // simple filter by title/company/location/tag
  let out = jobs;
  if (query.q) {
    const q = query.q.toLowerCase();
    out = out.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  }
  if (query.tag) {
    out = out.filter(j => j.tags && j.tags.includes(query.tag));
  }
  return Promise.resolve(out);
}

export function fetchJobById(id) {
  return Promise.resolve(jobs.find(j => j.id === id));
}
