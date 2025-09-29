const express = require('express');
const { 
  register, 
  login, 
  getRecruiterProfile, 
  sendOTP, 
  verifyOTP 
} = require('../controllers/recruiterAuthController');
const { recruiterProtect } = require('../middleware/recruiterAuth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', recruiterProtect, getRecruiterProfile);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;