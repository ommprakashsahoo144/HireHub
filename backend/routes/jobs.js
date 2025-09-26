
const express = require('express');
const router = express.Router();
const jobs = require('../data/jobs');

// GET /api/jobs - Get all jobs with optional filtering
router.get('/', (req, res) => {
  try {
    let filteredJobs = [...jobs];
    
    // Search by keyword (improved search with better ranking)
    if (req.query.q) {
      const query = req.query.q.toLowerCase().trim();
      filteredJobs = filteredJobs.filter(job => {
        const searchFields = [
          job.title.toLowerCase(),
          job.company.toLowerCase(),
          job.category.toLowerCase(),
          job.tags ? job.tags.join(' ').toLowerCase() : '',
          job.description ? job.description.toLowerCase() : ''
        ];
        
        return searchFields.some(field => field.includes(query));
      });

      // Enhanced relevance scoring
      filteredJobs.sort((a, b) => {
        const query = req.query.q.toLowerCase();
        let aScore = 0;
        let bScore = 0;

        // Exact title match gets highest priority
        if (a.title.toLowerCase() === query) aScore += 100;
        if (b.title.toLowerCase() === query) bScore += 100;
        
        // Title starts with query
        if (a.title.toLowerCase().startsWith(query)) aScore += 50;
        if (b.title.toLowerCase().startsWith(query)) bScore += 50;
        
        // Company name match
        if (a.company.toLowerCase().includes(query)) aScore += 30;
        if (b.company.toLowerCase().includes(query)) bScore += 30;
        
        // Category match
        if (a.category.toLowerCase().includes(query)) aScore += 20;
        if (b.category.toLowerCase().includes(query)) bScore += 20;
        
        // Tag match
        if (a.tags && a.tags.some(tag => tag.toLowerCase().includes(query))) aScore += 10;
        if (b.tags && b.tags.some(tag => tag.toLowerCase().includes(query))) bScore += 10;

        return bScore - aScore;
      });
    }
    
    // Filter by location (supports multiple locations and partial matching)
    if (req.query.location) {
      let locationQueries = req.query.location;
      if (!Array.isArray(locationQueries)) {
        locationQueries = [locationQueries];
      }
      
      locationQueries = locationQueries.map(loc => loc.toLowerCase().trim());
      
      filteredJobs = filteredJobs.filter(job => {
        const jobLocation = job.location.toLowerCase();
        return locationQueries.some(locQuery => jobLocation.includes(locQuery));
      });
    }
    
    // Filter by job type (case-insensitive with partial matching)
    if (req.query.type || req.query.jobType) {
      const typeQuery = (req.query.type || req.query.jobType).toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.type.toLowerCase().includes(typeQuery)
      );
    }
    
    // Filter by category (case-insensitive with partial matching)
    if (req.query.category) {
      const categoryQuery = req.query.category.toLowerCase().trim();
      filteredJobs = filteredJobs.filter(job =>
        job.category.toLowerCase().includes(categoryQuery)
      );
    }
    
    // Filter by level (case-insensitive with partial matching)
    if (req.query.level) {
      const levelQuery = req.query.level.toLowerCase().trim();
      filteredJobs = filteredJobs.filter(job => 
        job.level.toLowerCase().includes(levelQuery)
      );
    }

    res.json({
      success: true,
      count: filteredJobs.length,
      data: filteredJobs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
      error: error.message
    });
  }
});

// GET /api/jobs/:id - Get single job by ID
router.get('/:id', (req, res) => {
  try {
    const job = jobs.find(j => j.id === req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      data: job
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching job',
      error: error.message
    });
  }
});

// GET /api/jobs/categories - Get all unique categories
router.get('/meta/categories', (req, res) => {
  try {
    const categories = [...new Set(jobs.map(job => job.category))];
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
});

module.exports = router;