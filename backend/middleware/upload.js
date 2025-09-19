const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const uploadDirs = ['uploads/profile-pictures', 'uploads/resumes'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage for profile pictures
const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for resumes
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Create upload instances
const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Combined upload middleware
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'profilePicture') {
        cb(null, 'uploads/profile-pictures/');
      } else if (file.fieldname === 'resume') {
        cb(null, 'uploads/resumes/');
      } else {
        cb(new Error('Invalid field name'), false);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      if (file.fieldname === 'profilePicture') {
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
      } else if (file.fieldname === 'resume') {
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
      }
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'profilePicture') {
      imageFilter(req, file, cb);
    } else if (file.fieldname === 'resume') {
      pdfFilter(req, file, cb);
    } else {
      cb(new Error('Invalid field name'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;