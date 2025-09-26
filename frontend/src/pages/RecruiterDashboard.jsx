import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  Box, 
  Typography, 
  TextField, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  Business, 
  Work, 
  People, 
  Add, 
  Edit, 
  Delete,
  PostAdd,
  Person,
  Email,
  Phone,
  AccessTime
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function RecruiterDashboard() {
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Available categories and job types for dropdowns
  const categories = [
    'IT', 'Marketing', 'Sales', 'Healthcare', 'Finance', 
    'HR', 'Engineering', 'Design', 'Education', 'Hospitality', 'Legal'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'];

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    level: 'Mid-level',
    salary: '',
    category: 'IT',
    tags: [],
    description: '',
    currentTag: '' // For adding new tags
  });

  useEffect(() => {
    checkAuth();
    fetchJobs();
    fetchActiveUsers();
    
    // Set up interval to fetch active users every 30 seconds
    const interval = setInterval(fetchActiveUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || userType !== 'recruiter') {
      navigate('/recruiter-login');
      return;
    }

    setRecruiter(user);
    // Set company name from recruiter profile
    setJobForm(prev => ({
      ...prev,
      company: user.company?.name || ''
    }));
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recruiter/jobs/my-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
      }
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      setUserLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recruiter/active-users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setActiveUsers(data.users || []);
      } else {
        setActiveUsers([]);
      }
    } catch (err) {
      console.error('Failed to fetch active users');
      setActiveUsers([]);
    } finally {
      setUserLoading(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingJob 
        ? `http://localhost:5000/api/recruiter/jobs/${editingJob.id}`
        : 'http://localhost:5000/api/recruiter/jobs';
      
      const method = editingJob ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobForm)
      });

      const data = await response.json();
      if (data.success) {
        setShowJobModal(false);
        setEditingJob(null);
        resetJobForm();
        fetchJobs();
      } else {
        setError(data.message || 'Failed to save job');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: '',
      company: recruiter?.company?.name || '',
      location: '',
      type: 'Full-time',
      level: 'Mid-level',
      salary: '',
      category: 'IT',
      tags: [],
      description: '',
      currentTag: ''
    });
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      level: job.level,
      salary: job.salary,
      category: job.category,
      tags: job.tags || [],
      description: job.description,
      currentTag: ''
    });
    setShowJobModal(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recruiter/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchJobs();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const addTag = () => {
    if (jobForm.currentTag.trim() && !jobForm.tags.includes(jobForm.currentTag.trim())) {
      setJobForm({
        ...jobForm,
        tags: [...jobForm.tags, jobForm.currentTag.trim()],
        currentTag: ''
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setJobForm({
      ...jobForm,
      tags: jobForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/recruiter-login');
  };

  const formatLastActive = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diffInSeconds = Math.floor((now - lastActive) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
    
    return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;
  };

  if (loading && !recruiter) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Spinner animation="border" />
      </Box>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 3 }}>
        <Container>
          <Row className="align-items-center">
            <Col>
              <Box display="flex" alignItems="center" gap={2}>
                <Business sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    Recruiter Dashboard
                  </Typography>
                  <Typography variant="body1">
                    Welcome back, {recruiter?.name} - {recruiter?.company?.name}
                  </Typography>
                </Box>
              </Box>
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </Box>

      <Container className="py-4">
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <Business sx={{ fontSize: 40, color: '#667eea', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">{jobs.length}</Typography>
                <Typography variant="body2" color="textSecondary">Posted Jobs</Typography>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <Work sx={{ fontSize: 40, color: '#28a745', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">
                  {jobs.reduce((total, job) => total + (job.applications?.length || 0), 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">Total Applications</Typography>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <People sx={{ fontSize: 40, color: '#ffc107', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">{activeUsers.length}</Typography>
                <Typography variant="body2" color="textSecondary">Active Candidates</Typography>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body className="text-center">
                <AccessTime sx={{ fontSize: 40, color: '#dc3545', mb: 2 }} />
                <Typography variant="h4" fontWeight="bold">Real-time</Typography>
                <Typography variant="body2" color="textSecondary">Live Tracking</Typography>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Active Users Section */}
          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Active Job Seekers
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {userLoading && <Spinner animation="border" size="sm" className="me-2" />}
                    <Typography variant="caption" color="textSecondary">
                      {activeUsers.length} online
                    </Typography>
                  </Box>
                </Box>
              </Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {activeUsers.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <People sx={{ fontSize: 40, color: '#ccc', mb: 2 }} />
                    <Typography variant="body2" color="textSecondary">
                      No active job seekers at the moment
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {activeUsers.map((user, index) => (
                      <Box 
                        key={user.id || index} 
                        display="flex" 
                        alignItems="center" 
                        gap={2} 
                        py={1}
                        borderBottom={index < activeUsers.length - 1 ? '1px solid #f0f0f0' : 'none'}
                      >
                        <Box 
                          sx={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            backgroundColor: '#28a745',
                            animation: 'pulse 1.5s infinite'
                          }} 
                        />
                        <Person sx={{ color: '#667eea' }} />
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight="bold">
                            {user.name || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.email || 'No email'}
                          </Typography>
                          <Typography variant="caption" display="block" color="textSecondary">
                            Last active: {formatLastActive(user.lastActive)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Jobs Section */}
          <Col md={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    My Job Postings
                  </Typography>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowJobModal(true)}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    <Add sx={{ mr: 1 }} />
                    Post New Job
                  </Button>
                </Box>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <Spinner animation="border" />
                  </Box>
                ) : jobs.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <PostAdd sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      No jobs posted yet
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      Start by posting your first job opening
                    </Typography>
                    <Button 
                      variant="primary"
                      onClick={() => setShowJobModal(true)}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      Post Your First Job
                    </Button>
                  </Box>
                ) : (
                  <Row>
                    {jobs.map(job => (
                      <Col md={6} key={job.id} className="mb-3">
                        <Card className="h-100 shadow-sm">
                          <Card.Body>
                            <Typography variant="h6" fontWeight="bold" className="text-primary">
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="fw-bold">
                              {job.company}
                            </Typography>
                            <Typography variant="body2" className="mb-2">
                              📍 {job.location}
                            </Typography>
                            
                            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                              <Chip label={job.type} size="small" color="primary" variant="outlined" />
                              <Chip label={job.level} size="small" color="secondary" variant="outlined" />
                              <Chip label={job.category} size="small" color="success" variant="outlined" />
                            </Box>

                            {job.tags && job.tags.length > 0 && (
                              <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
                                {job.tags.map((tag, index) => (
                                  <Chip 
                                    key={index} 
                                    label={tag} 
                                    size="small" 
                                    variant="filled"
                                    sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                                  />
                                ))}
                              </Box>
                            )}

                            <Typography variant="body2" className="text-success fw-bold mb-2">
                              💰 {job.salary}
                            </Typography>

                            <Typography variant="body2" color="textSecondary" className="small">
                              {job.description.substring(0, 100)}...
                            </Typography>

                            <Box display="flex" justifyContent="space-between" mt={2}>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleEditJob(job)}
                              >
                                <Edit sx={{ fontSize: 16, mr: 0.5 }} />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Delete sx={{ fontSize: 16, mr: 0.5 }} />
                                Delete
                              </Button>
                            </Box>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Job Posting Modal */}
      <Dialog 
        open={showJobModal} 
        onClose={() => {
          setShowJobModal(false);
          setEditingJob(null);
          resetJobForm();
        }}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
          </Typography>
        </DialogTitle>
        
        <Form onSubmit={handleJobSubmit}>
          <DialogContent dividers>
            <Row className="g-3">
              <Col md={6}>
                <TextField
                  fullWidth
                  label="Job Title *"
                  name="title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  required
                  margin="normal"
                  placeholder="e.g., Digital Marketing Manager"
                />
              </Col>
              
              <Col md={6}>
                <TextField
                  fullWidth
                  label="Company *"
                  name="company"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                  required
                  margin="normal"
                  placeholder="e.g., BrandBoost"
                />
              </Col>

              <Col md={6}>
                <TextField
                  fullWidth
                  label="Location *"
                  name="location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                  required
                  margin="normal"
                  placeholder="e.g., Mumbai, India"
                />
              </Col>
              
              <Col md={6}>
                <TextField
                  fullWidth
                  label="Salary *"
                  name="salary"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                  required
                  margin="normal"
                  placeholder="e.g., ₹6,00,000 - ₹10,00,000"
                />
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Job Type *</Form.Label>
                  <Form.Select
                    name="type"
                    value={jobForm.type}
                    onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                    required
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Experience Level *</Form.Label>
                  <Form.Select
                    name="level"
                    value={jobForm.level}
                    onChange={(e) => setJobForm({...jobForm, level: e.target.value})}
                    required
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={jobForm.category}
                    onChange={(e) => setJobForm({...jobForm, category: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Tags</Form.Label>
                  <Box display="flex" gap={1} alignItems="center" mb={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a tag (e.g., SEO, React, Marketing)"
                      value={jobForm.currentTag}
                      onChange={(e) => setJobForm({...jobForm, currentTag: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={addTag}
                      disabled={!jobForm.currentTag.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                  
                  {jobForm.tags.length > 0 && (
                    <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                      {jobForm.tags.map((tag, index) => (
                        <Chip 
                          key={index}
                          label={tag}
                          size="small"
                          onDelete={() => removeTag(tag)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <TextField
                  fullWidth
                  label="Job Description *"
                  name="description"
                  multiline
                  rows={4}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  required
                  margin="normal"
                  placeholder="Describe the job responsibilities, requirements, and what you're looking for in a candidate..."
                />
              </Col>
            </Row>
          </DialogContent>
          
          <DialogActions>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowJobModal(false);
                setEditingJob(null);
                resetJobForm();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={submitting}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingJob ? 'Updating...' : 'Posting...'}
                </>
              ) : (
                editingJob ? 'Update Job' : 'Post Job'
              )}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}