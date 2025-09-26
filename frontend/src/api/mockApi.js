
const API_BASE_URL = "http://localhost:5000/api";

export function fetchJobs(query = {}) {
  return new Promise(async (resolve) => {
    try {
      // Build query parameters matching your backend API structure
      const queryParams = new URLSearchParams();
      
      // Map frontend query parameters to backend parameters
      if (query.q) queryParams.append('q', query.q);
      
      // Location search - handle both frontend and backend formats
      if (query.location) {
        if (Array.isArray(query.location)) {
          query.location.forEach(loc => queryParams.append('location', loc));
        } else {
          queryParams.append('location', query.location);
        }
      }
      
      // Job type search - support both 'type' and 'jobType'
      if (query.jobType) queryParams.append('type', query.jobType);
      if (query.type) queryParams.append('type', query.type);
      
      // Category search
      if (query.category) queryParams.append('category', query.category);
      
      // Level filter
      if (query.level) queryParams.append('level', query.level);
      
      console.log('Fetching from backend with query:', queryParams.toString());
      
      const response = await fetch(`${API_BASE_URL}/jobs?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        resolve(data.data || []);
      } else {
        resolve([]);
      }
      
    } catch (error) {
      console.error('Error fetching jobs from backend:', error);
      resolve([]);
    }
  });
}



export function fetchJobById(id) {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        resolve(data.data);
      } else {
        resolve(null);
      }
      
    } catch (error) {
      console.error('Error fetching job from backend:', error);
      // Return null if backend fails - remove local fallback
      resolve(null);
    }
  });
}