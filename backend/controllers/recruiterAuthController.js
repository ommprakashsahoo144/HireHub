const Recruiter = require('../models/Recruiter');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    const mailOptions = {
      from: `"HireHub Recruiter" <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

// OTP storage (in production, use Redis or database)
const otpStorage = new Map();

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    const recruiterExists = await Recruiter.findOne({ email });
    if (recruiterExists) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter already exists with this email'
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP temporarily
    otpStorage.set(email, { otp, expiry: otpExpiry });
    
    console.log(`OTP for ${email}: ${otp}`); // For development
    
    const message = `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`;
    
    try {
      await sendEmail({
        email: email,
        subject: 'Email Verification OTP - HireHub',
        message: message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #764ba2;">Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <h1 style="font-size: 32px; color: #667eea; text-align: center; letter-spacing: 10px; margin: 20px 0;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">HireHub Recruiter Team</p>
          </div>
        `
      });
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your email'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      otpStorage.delete(email); // Remove OTP if email fails
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, userData } = req.body;
    
    // Check if OTP exists and is valid
    const storedOtpData = otpStorage.get(email);
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }
    
    // Check OTP expiry
    if (Date.now() > storedOtpData.expiry) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }
    
    // OTP verified successfully, create recruiter
    const recruiter = await Recruiter.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      position: userData.position,
      company: {
        name: userData.companyName
      },
      isVerified: true
    });
    
    // Remove OTP after successful verification
    otpStorage.delete(email);
    
    if (recruiter) {
      res.status(201).json({
        success: true,
        token: generateToken(recruiter._id),
        recruiter: {
          id: recruiter._id,
          name: recruiter.name,
          email: recruiter.email,
          company: recruiter.company
        },
        message: 'Account created successfully!'
      });
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, companyName, phone, position } = req.body;
    
    const recruiterExists = await Recruiter.findOne({ email });
    if (recruiterExists) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter already exists with this email'
      });
    }
    
    const recruiter = await Recruiter.create({
      name,
      email,
      password,
      phone,
      position,
      company: {
        name: companyName
      }
    });
    
    if (recruiter) {
      res.status(201).json({
        success: true,
        token: generateToken(recruiter._id),
        recruiter: {
          id: recruiter._id,
          name: recruiter.name,
          email: recruiter.email,
          company: recruiter.company
        }
      });
    }
  } catch (error) {
    console.error('Recruiter registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const recruiter = await Recruiter.findOne({ email }).select('+password');
    
    if (!recruiter) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const isMatch = await recruiter.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    res.status(200).json({
      success: true,
      token: generateToken(recruiter._id),
      recruiter: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company
      }
    });
  } catch (error) {
    console.error('Recruiter login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

exports.getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter.id).select('-password');
    
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    res.status(200).json({
      success: true,
      recruiter
    });
  } catch (error) {
    console.error('Get recruiter profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};