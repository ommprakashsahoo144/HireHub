import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

export default function RecruiterLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await fetch('http://localhost:5000/api/recruiter/auth/login', {
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
        setError(data.message || 'Login failed');
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
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <Box className="text-center mb-4">
                  <BusinessIcon sx={{ fontSize: 50, color: '#764ba2', mb: 2 }} />
                  <Typography variant="h4" component="h1" gutterBottom style={{ color: '#333', fontWeight: 'bold' }}>
                    Recruiter Login
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Access your recruiter dashboard
                  </Typography>
                </Box>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
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
                    {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                  </Button>
                </Form>

                <Box className="text-center mt-3">
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link 
                      to="/recruiter-signup" 
                      style={{ color: '#764ba2', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Sign up here
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