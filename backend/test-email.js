// test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'ommprakashsahoo144@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email from HireHub',
    });
    
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

testEmail();