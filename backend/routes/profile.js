const express = require('express');
const {
  getProfile,
  updateBasicProfile,
  uploadProfilePicture,
  uploadResume,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put('/basic', updateBasicProfile);
router.post('/upload-picture', upload.single('profilePicture'), uploadProfilePicture);
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Education routes
router.post('/education', addEducation);
router.put('/education/:educationId', updateEducation);
router.delete('/education/:educationId', deleteEducation);

// Experience routes
router.post('/experience', addExperience);
router.put('/experience/:experienceId', updateExperience);
router.delete('/experience/:experienceId', deleteExperience);

// Project routes
router.post('/projects', addProject);
router.put('/projects/:projectId', updateProject);
router.delete('/projects/:projectId', deleteProject);

// Skill routes
router.post('/skills', addSkill);
router.put('/skills/:skillId', updateSkill);
router.delete('/skills/:skillId', deleteSkill);

module.exports = router;