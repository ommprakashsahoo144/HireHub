const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Generate OTP (6 digits)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email function
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
    
    // Define email options
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Forgot password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Hash OTP and set to resetPasswordOTP field
    user.resetPasswordOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    
    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    // Save without validating password
    await user.save({ validateBeforeSave: false });
    
    // Email message
    const message = `You are receiving this email because you requested a password reset. Your OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.`;
    
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You are receiving this email because you requested a password reset for your HireHub account.</p>
        <p>Your OTP code is:</p>
        <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p><strong>This OTP will expire in 10 minutes.</strong></p>
        <p>If you didn't request this reset, please ignore this email.</p>
      </div>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP - HireHub',
        message: message,
        html: htmlMessage
      });
      
      res.status(200).json({
        success: true,
        message: 'Email sent with OTP for password reset'
      });
    } catch (error) {
      // If email fails, clear the reset OTP
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error('Email sending error:', error);
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Get hashed OTP
    const resetPasswordOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    
    const user = await User.findOne({
      email,
      resetPasswordOTP,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Reset password with OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    
    // Get hashed OTP
    const resetPasswordOTP = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    
    const user = await User.findOne({
      email,
      resetPasswordOTP,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    
    // Save with validation for the new password
    await user.save();
    
    // Send confirmation email
    const message = `Your password has been successfully reset. If you did not make this change, please contact support immediately.`;
    
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Successful</h2>
        <p>Your password has been successfully reset.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      </div>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Successful - HireHub',
        message: message,
        html: htmlMessage
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
      // Continue even if confirmation email fails
    }
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    // Handle password validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};