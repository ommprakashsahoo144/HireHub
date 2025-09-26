const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { recruiterProtect } = require('../middleware/recruiterAuth');

// Path to jobs data file
const jobsFilePath = path.join(__dirname, '../data/jobs.js');

// Helper function to read jobs from file
const readJobsFromFile = () => {
  try {
    const fileContent = fs.readFileSync(jobsFilePath, 'utf8');
    // Extract the jobs array from the module.exports
    const match = fileContent.match(/const jobs = (\[.*?\]);/s);
    if (match) {
      return eval(match[1]);
    }
    return [];
  } catch (error) {
    console.error('Error reading jobs file:', error);
    return [];
  }
};

// Helper function to write jobs to file
const writeJobsToFile = (jobs) => {
  try {
    const fileContent = `const jobs = ${JSON.stringify(jobs, null, 2)};\n\nmodule.exports = jobs;`;
    fs.writeFileSync(jobsFilePath, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing jobs file:', error);
    return false;
  }
};

// GET recruiter's posted jobs
router.get('/my-jobs', recruiterProtect, (req, res) => {
  try {
    const jobs = readJobsFromFile();
    const recruiterJobs = jobs.filter(job => job.postedBy === req.recruiter.id);
    
    res.json({
      success: true,
      count: recruiterJobs.length,
      data: recruiterJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching jobs',
      error: error.message
    });
  }
});

// POST create new job
router.post('/', recruiterProtect, (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      level,
      salary,
      category,
      tags,
      description
    } = req.body;

    const jobs = readJobsFromFile();
    
    // Generate new ID
    const newId = (jobs.length > 0 ? Math.max(...jobs.map(j => parseInt(j.id))) + 1 : 1).toString();

    const newJob = {
      id: newId,
      title,
      company: company || req.recruiter.company.name,
      location,
      type,
      level,
      salary,
      category,
      tags: tags || [],
      description,
      postedBy: req.recruiter.id,
      postedDate: new Date().toISOString()
    };

    jobs.push(newJob);
    
    if (writeJobsToFile(jobs)) {
      res.status(201).json({
        success: true,
        message: 'Job posted successfully',
        data: newJob
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to save job to file'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating job',
      error: error.message
    });
  }
});

// PUT update job
router.put('/:id', recruiterProtect, (req, res) => {
  try {
    const jobs = readJobsFromFile();
    const jobIndex = jobs.findIndex(job => job.id === req.params.id && job.postedBy === req.recruiter.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not authorized'
      });
    }

    jobs[jobIndex] = { 
      ...jobs[jobIndex], 
      ...req.body,
      id: req.params.id // Ensure ID doesn't change
    };

    if (writeJobsToFile(jobs)) {
      res.json({
        success: true,
        message: 'Job updated successfully',
        data: jobs[jobIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update job in file'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating job',
      error: error.message
    });
  }
});

// DELETE job
router.delete('/:id', recruiterProtect, (req, res) => {
  try {
    const jobs = readJobsFromFile();
    const jobIndex = jobs.findIndex(job => job.id === req.params.id && job.postedBy === req.recruiter.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not authorized'
      });
    }

    const deletedJob = jobs.splice(jobIndex, 1)[0];

    if (writeJobsToFile(jobs)) {
      res.json({
        success: true,
        message: 'Job deleted successfully',
        data: deletedJob
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete job from file'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting job',
      error: error.message
    });
  }
});

module.exports = router;