const express = require('express');
const { register, login, getRecruiterProfile } = require('../controllers/recruiterAuthController');
const { recruiterProtect } = require('../middleware/recruiterAuth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', recruiterProtect, getRecruiterProfile);

module.exports = router;