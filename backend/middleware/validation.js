const validator = require('validator');

exports.validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];
  
  // Name validation
  if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name should contain only letters and spaces');
  }
  
  // Email validation
  if (!email || !validator.isEmail(email) || !/^[a-z0-9._%+-]+@[a-z]+(\.(gmail|in|com|org|net|edu)){1,}$/.test(email)) {
    errors.push('Please provide a valid email address');
  }
  
  // Password validation
  if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: errors.join(', ') 
    });
  }
  
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  
  if (!email || !validator.isEmail(email)) {
    errors.push('Please provide a valid email address');
  }
  
  if (!password) {
    errors.push('Password is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false, 
      message: errors.join(', ') 
    });
  }
  
  next();
};