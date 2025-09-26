import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/recruiter/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.recruiter));
        localStorage.setItem('userType', 'recruiter');
        navigate('/recruiter/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <Box className="text-center mb-4">
                  <BusinessIcon sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
                  <Typography variant="h4" component="h1" gutterBottom style={{ color: '#333', fontWeight: 'bold' }}>
                    Recruiter Sign Up
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Create your recruiter account
                  </Typography>
                </Box>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                      />
                    </Col>
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                      />
                    </Col>
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Your Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                      />
                    </Col>
                  </Row>

                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                  />

                  <Row>
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                      />
                    </Col>
                    <Col md={6}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        margin="normal"
                        variant="outlined"
                      />
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="w-100 py-2 mt-3"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      fontSize: '1.1rem'
                    }}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Create Account'}
                  </Button>
                </Form>

                <Box className="text-center mt-3">
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link 
                      to="/recruiter-login" 
                      style={{ color: '#764ba2', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Login here
                    </Link>
                  </Typography>
                  <Typography variant="body2" className="mt-2">
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
    </div>
  );
}