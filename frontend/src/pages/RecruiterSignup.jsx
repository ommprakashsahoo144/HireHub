import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function RecruiterSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const sendOtp = async () => {
    try {
      setOtpLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/recruiter/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        setShowOtpModal(true);
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.companyName) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Password validation as per backend schema
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character with minimum 8 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Send OTP for verification
    await sendOtp();
    setLoading(false);
  };

  const verifyOtp = async () => {
    try {
      setOtpLoading(true);
      setError('');
      const otpString = otp.join('');

      if (otpString.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        setOtpLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/recruiter/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString,
          userData: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            companyName: formData.companyName,
            phone: formData.phone,
            position: formData.position
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationSuccess(true);
        setTimeout(() => {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.recruiter));
          localStorage.setItem('userType', 'recruiter');
          navigate('/recruiter/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    await sendOtp();
    setOtp(['', '', '', '', '', '']);
    // Focus first OTP input
    const firstInput = document.getElementById('otp-0');
    if (firstInput) firstInput.focus();
  };

  const closeOtpModal = () => {
    if (!verificationSuccess) {
      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);
      setOtpSent(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 0.5rem'
    }}>
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-4 p-md-5">
                <Box className="text-center mb-4">
                  <BusinessIcon sx={{ fontSize: { xs: 40, md: 50 }, color: '#764ba2', mb: 2 }} />
                  <Typography variant="h4" component="h1" gutterBottom style={{ color: '#333', fontWeight: 'bold', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
                    Recruiter Sign Up
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Create your recruiter account
                  </Typography>
                </Box>

                {error && (
                  <Alert variant="danger" className="mb-3" style={{ fontSize: '0.9rem' }}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Company Name *"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Your Position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password *"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    size="small"
                    helperText="Min 8 chars with uppercase, lowercase, number & special character"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm Password *"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      style: { fontSize: '16px' }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="w-100 py-3 mt-3"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      fontSize: '1.1rem',
                      borderRadius: '10px',
                      minHeight: '50px'
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP & Create Account'}
                  </Button>
                </Form>

                <Box className="text-center mt-4">
                  <Typography variant="body2" style={{ fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link 
                      to="/recruiter-login" 
                      style={{ color: '#764ba2', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Login here
                    </Link>
                  </Typography>
                  <Typography variant="body2" className="mt-2" style={{ fontSize: '0.9rem' }}>
                    <Link 
                      to="/" 
                      style={{ color: '#666', textDecoration: 'none' }}
                    >
                      ← Back to Home
                    </Link>
                  </Typography>
                </Box>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Verification Modal */}
      <Modal show={showOtpModal} onHide={closeOtpModal} centered backdrop="static">
        <Modal.Header closeButton={!verificationSuccess}>
          <Modal.Title className="w-100 text-center">
            {verificationSuccess ? (
              <Box className="text-center">
                <VerifiedIcon sx={{ fontSize: 50, color: '#28a745', mb: 2 }} />
                <Typography variant="h5" style={{ color: '#28a745' }}>
                  Verification Successful!
                </Typography>
              </Box>
            ) : (
              'Email Verification'
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {verificationSuccess ? (
            <Box>
              <Typography variant="body1" className="mb-3">
                Your email has been verified successfully!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Redirecting to dashboard...
              </Typography>
              <Spinner animation="border" className="mt-3" />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" className="mb-3">
                We've sent a 6-digit OTP to your email:
              </Typography>
              <Typography variant="body2" className="fw-bold text-primary mb-4">
                {formData.email}
              </Typography>
              
              <Box className="mb-4">
                <Typography variant="body2" className="mb-3">
                  Enter the OTP below:
                </Typography>
                <Box display="flex" justifyContent="center" gap={1}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      style={{ 
                        width: '45px',
                        height: '55px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                  ))}
                </Box>
              </Box>

              {error && (
                <Alert variant="danger" className="mb-3" style={{ fontSize: '0.9rem' }}>
                  {error}
                </Alert>
              )}

              <Button
                onClick={verifyOtp}
                disabled={otpLoading || otp.some(digit => digit === '')}
                variant="primary"
                className="w-100 py-2 mb-2"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                {otpLoading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
              </Button>

              <Button
                onClick={resendOtp}
                disabled={otpLoading}
                variant="outline-secondary"
                className="w-100 py-2"
                style={{ borderRadius: '10px' }}
              >
                Resend OTP
              </Button>
            </Box>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}