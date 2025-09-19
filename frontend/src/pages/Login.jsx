import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Modal, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState({});
  const [apiError, setApiError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@[a-z]+(\.(gmail|in|com|org|net|edu)){1,}$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate individual fields as user types
    if (name === 'email') {
      const isValid = validateEmail(value);
      setValidated({...validated, email: isValid});
      setErrors({...errors, email: isValid ? '' : 'Please enter a valid email address'});
    }
  };

  // Block emoji input
  const blockEmoji = (e) => {
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    if (emojiRegex.test(e.target.value)) {
      e.target.value = e.target.value.replace(emojiRegex, '');
      setForm({...form, [e.target.name]: e.target.value});
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    
    // Validate all fields
    const emailValid = validateEmail(form.email);
    
    setValidated({
      email: emailValid,
    });
    
    if (!emailValid) {
      setErrors({...errors, email: 'Please enter a valid email address'});
      return;
    }
    
    if (!form.password) {
      setErrors({...errors, password: 'Password is required'});
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
        
        // Show success message
        setSuccessMessage("Your login is successful! Redirecting to home...");
        
        // Clear form
        setForm({ email: "", password: "" });
        setValidated({});
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setApiError(data.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setApiError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setApiError('Network error. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetMessage("");
    
    if (!validateEmail(resetEmail)) {
      setResetMessage("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetMessage("OTP sent to your email. Please check your inbox.");
        setCurrentStep(2); // Move to OTP verification step
      } else {
        setResetMessage(data.message || `Error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setResetMessage('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setResetMessage('Network error. Please try again.');
      }
      console.error('Send OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetMessage("");
    
    if (!otp || otp.length !== 6) {
      setResetMessage("Please enter a valid 6-digit OTP");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetMessage("OTP verified successfully. Please set your new password.");
        setCurrentStep(3); // Move to new password step
      } else {
        setResetMessage(data.message || `Error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setResetMessage('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setResetMessage('Network error. Please try again.');
      }
      console.error('Verify OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetMessage("");
    
    if (!newPassword) {
      setResetMessage("Please enter a new password");
      setIsLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setResetMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail, otp, password: newPassword }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResetMessage("Password reset successfully! You can now login with your new password.");
        setTimeout(() => {
          closeResetModal();
          setShowResetModal(false);
        }, 2000);
      } else {
        setResetMessage(data.message || `Error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setResetMessage('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setResetMessage('Network error. Please try again.');
      }
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setShowOTPModal(false);
    setShowNewPasswordModal(false);
    setResetMessage("");
    setResetEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentStep(1);
    setIsLoading(false);
  };

  const openResetModal = () => {
    setShowResetModal(true);
    setCurrentStep(1);
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Card style={{ width: "100%", maxWidth: 420, padding: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h3 className="mb-3 text-center fw-bold">Login to HireHub</h3>
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="position-relative">
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleInputChange}
                  onInput={blockEmoji}
                  isInvalid={!!errors.email}
                  isValid={validated.email}
                  required
                />
                {validated.email && (
                  <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-success">
                    ✓
                  </span>
                )}
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Must be a valid email address (e.g., example@gmail.com)
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onInput={blockEmoji}
                isInvalid={!!errors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Button type="submit" className="w-100 mb-3" variant="primary" size="lg">
              Login
            </Button>
            
            <div className="text-center mb-3">
              <a href="#" onClick={openResetModal} className="text-primary fw-semibold text-decoration-none">
                Forgot Password?
              </a>
            </div>
            
            <p className="text-center mt-3 mb-0">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary fw-semibold text-decoration-none">Sign Up</Link>
            </p>
          </Form>
        </Card>
      </Container>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onHide={closeResetModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentStep === 1 && "Reset Password - Step 1: Enter Email"}
            {currentStep === 2 && "Reset Password - Step 2: Enter OTP"}
            {currentStep === 3 && "Reset Password - Step 3: New Password"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resetMessage && (
            <Alert variant={resetMessage.includes("success") ? "success" : "danger"}>
              {resetMessage}
            </Alert>
          )}
          
          {currentStep === 1 && (
            <Form onSubmit={handleSendOTP}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Form.Text className="text-muted">
                  We'll send an OTP to this email
                </Form.Text>
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </Form>
          )}
          
          {currentStep === 2 && (
            <Form onSubmit={handleVerifyOTP}>
              <Form.Group className="mb-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={isLoading}
                />
                <Form.Text className="text-muted">
                  Check your email for the OTP
                </Form.Text>
              </Form.Group>
              <Row>
                <Col>
                  <Button 
                    variant="secondary" 
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </Col>
                <Col>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          
          {currentStep === 3 && (
            <Form onSubmit={handleResetPassword}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Form.Group>
              <Row>
                <Col>
                  <Button 
                    variant="secondary" 
                    onClick={() => setCurrentStep(2)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </Col>
                <Col>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}