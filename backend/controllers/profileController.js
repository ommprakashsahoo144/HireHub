const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordOTP -resetPasswordExpire');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update basic profile
exports.updateBasicProfile = async (req, res) => {
  try {
    const { name, phone, location, summary, currentTitle } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, location, summary, currentTitle },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordOTP -resetPasswordExpire');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, '../uploads/profile-pictures', user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    user.profilePicture = req.file.filename;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: req.file.filename
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Delete old resume if exists
    if (user.resume) {
      const oldResumePath = path.join(__dirname, '../uploads/resumes', user.resume);
      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }
    
    user.resume = req.file.filename;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: req.file.filename
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Add education
exports.addEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.education.push(req.body);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Education added successfully',
      education: user.education
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update education
exports.updateEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    const user = await User.findById(req.user.id);
    
    const educationIndex = user.education.findIndex(edu => edu._id.toString() === educationId);
    
    if (educationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }
    
    user.education[educationIndex] = { ...user.education[educationIndex].toObject(), ...req.body };
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Education updated successfully',
      education: user.education
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete education
exports.deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    const user = await User.findById(req.user.id);
    
    user.education = user.education.filter(edu => edu._id.toString() !== educationId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
      education: user.education
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Add experience
exports.addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.experience.push(req.body);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Experience added successfully',
      experience: user.experience
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update experience
exports.updateExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const user = await User.findById(req.user.id);
    
    const experienceIndex = user.experience.findIndex(exp => exp._id.toString() === experienceId);
    
    if (experienceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    user.experience[experienceIndex] = { ...user.experience[experienceIndex].toObject(), ...req.body };
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      experience: user.experience
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const user = await User.findById(req.user.id);
    
    user.experience = user.experience.filter(exp => exp._id.toString() !== experienceId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
      experience: user.experience
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Add project
exports.addProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.projects.push(req.body);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Project added successfully',
      projects: user.projects
    });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user.id);
    
    const projectIndex = user.projects.findIndex(proj => proj._id.toString() === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    user.projects[projectIndex] = { ...user.projects[projectIndex].toObject(), ...req.body };
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      projects: user.projects
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user.id);
    
    user.projects = user.projects.filter(proj => proj._id.toString() !== projectId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      projects: user.projects
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Add skill
exports.addSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.skills.push(req.body);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user.id);
    
    const skillIndex = user.skills.findIndex(skill => skill._id.toString() === skillId);
    
    if (skillIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    user.skills[skillIndex] = { ...user.skills[skillIndex].toObject(), ...req.body };
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user.id);
    
    user.skills = user.skills.filter(skill => skill._id.toString() !== skillId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      skills: user.skills
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};