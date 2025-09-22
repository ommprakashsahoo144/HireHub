import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Row, Col, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState({});
  const [apiError, setApiError] = useState("");
  const [passwordTests, setPasswordTests] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: password
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpHash, setOtpHash] = useState("");
  const [otpExpire, setOtpExpire] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name) && name.length >= 2;
  };

  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@[a-z]+(\.(gmail|in|com|org|net|edu)){1,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;
    
    // Update password tests
    setPasswordTests({
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      hasMinLength
    });
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
  };

  // Block digits in name field
  const blockDigitsInName = (e) => {
    if (e.target.name === 'name') {
      e.target.value = e.target.value.replace(/[0-9]/g, '');
      setForm({ ...form, [e.target.name]: e.target.value });
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

  // Block special characters in name field
  const blockSpecialCharsInName = (e) => {
    if (e.target.name === 'name') {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate individual fields as user types
    if (name === 'name') {
      const isValid = validateName(value);
      setValidated({...validated, name: isValid});
      setErrors({...errors, name: isValid ? '' : 'Name should contain only letters and spaces'});
    }
    
    if (name === 'email') {
      const isValid = validateEmail(value);
      setValidated({...validated, email: isValid});
      setErrors({...errors, email: isValid ? '' : 'Please enter a valid email address'});
    }
    
    if (name === 'password') {
      const isValid = validatePassword(value);
      setValidated({...validated, password: isValid});
      if (!value) {
        setErrors({...errors, password: ''});
      } else {
        setErrors({...errors, password: isValid ? '' : 
          'Password must meet all requirements'});
      }
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  // Send OTP to email
  const sendOtp = async () => {
    setApiError("");
    setLoading(true);
    
    const emailValid = validateEmail(form.email);
    if (!emailValid) {
      setErrors({...errors, email: 'Please enter a valid email address'});
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: form.email }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setOtpHash(data.otpHash);
        setOtpExpire(data.otpExpire);
        setOtpSent(true);
        setStep(2);
        
        // Start countdown timer
        setCountdown(600); // 10 minutes in seconds
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send OTP' }));
        setApiError(errorData.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setApiError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setApiError('Network error. Please try again.');
      }
      console.error('Send OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    setApiError("");
    setLoading(true);
    
    if (otp.length !== 6) {
      setApiError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: form.email, 
          otp: otp,
          otpHash: otpHash
        }),
      });
      
      if (response.ok) {
        setStep(3);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to verify OTP' }));
        setApiError(errorData.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setApiError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setApiError('Network error. Please try again.');
      }
      console.error('Verify OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Final registration
  const submit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    
    // Validate all fields
    const nameValid = validateName(form.name);
    const emailValid = validateEmail(form.email);
    const passwordValid = validatePassword(form.password);
    
    setValidated({
      name: nameValid,
      email: emailValid,
      password: passwordValid
    });
    
    if (!nameValid) {
      setErrors({...errors, name: 'Name should contain only letters and spaces'});
    }
    
    if (!emailValid) {
      setErrors({...errors, email: 'Please enter a valid email address'});
    }
    
    if (!passwordValid) {
      setErrors({...errors, password: 'Password must meet all requirements'});
    }
    
    if (!nameValid || !emailValid || !passwordValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setSuccessMessage("Your signup is successful! Redirecting to login...");
        
        setForm({ name: "", email: "", password: "" });
        setValidated({});
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        setApiError(errorData.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setApiError('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setApiError('Network error. Please try again.');
      }
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Password requirements tooltip
  const passwordRequirementsTooltip = (props) => (
    <Tooltip id="password-tooltip" {...props} className="password-tooltip-custom">
      <div className="mb-1"><small>Password must contain:</small></div>
      <div className={passwordTests.hasUpperCase ? "text-success" : "text-danger"}>
        {passwordTests.hasUpperCase ? "✓ " : "✗ "}At least one uppercase letter
      </div>
      <div className={passwordTests.hasLowerCase ? "text-success" : "text-danger"}>
        {passwordTests.hasLowerCase ? "✓ " : "✗ "}At least one lowercase letter
      </div>
      <div className={passwordTests.hasNumber ? "text-success" : "text-danger"}>
        {passwordTests.hasNumber ? "✓ " : "✗ "}At least one number
      </div>
      <div className={passwordTests.hasSpecialChar ? "text-success" : "text-danger"}>
        {passwordTests.hasSpecialChar ? "✓ " : "✗ "}At least one special character
      </div>
      <div className={passwordTests.hasMinLength ? "text-success" : "text-danger"}>
        {passwordTests.hasMinLength ? "✓ " : "✗ "}At least 8 characters long
      </div>
    </Tooltip>
  );

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card style={{ width: "100%", maxWidth: 520, padding: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h3 className="mb-3 text-center fw-bold">Create an Account</h3>
        {apiError && <Alert variant="danger">{apiError}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        
        {step === 1 && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <div className="position-relative">
                <Form.Control
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleInputChange}
                  onInput={(e) => {
                    blockDigitsInName(e);
                    blockEmoji(e);
                    blockSpecialCharsInName(e);
                  }}
                  isInvalid={!!errors.name}
                  isValid={validated.name}
                  required
                />
                {validated.name && (
                  <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-success">
                    ✓
                  </span>
                )}
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Only letters and spaces allowed (no numbers or special characters)
              </Form.Text>
            </Form.Group>
            
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
            
            <Button 
              onClick={sendOtp} 
              className="w-100 mb-3" 
              variant="primary" 
              size="lg"
              disabled={loading || !validated.name || !validated.email}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Send Verification Code"}
            </Button>
          </>
        )}
        
        {step === 2 && (
          <>
            <Alert variant="info" className="mb-3">
              We've sent a 6-digit verification code to <strong>{form.email}</strong>. 
              Please check your inbox and enter the code below.
            </Alert>
            
            <Form.Group className="mb-3">
              <Form.Label>Verification Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                required
              />
              {countdown > 0 ? (
                <Form.Text className="text-muted">
                  Code expires in: {formatTime(countdown)}
                </Form.Text>
              ) : (
                <Form.Text className="text-danger">
                  Code expired. <Button variant="link" className="p-0" onClick={sendOtp}>Resend code</Button>
                </Form.Text>
              )}
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => setStep(1)}
                className="flex-fill"
              >
                Back
              </Button>
              <Button 
                onClick={verifyOtp} 
                className="flex-fill" 
                variant="primary" 
                disabled={loading || otp.length !== 6 || countdown === 0}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Verify Code"}
              </Button>
            </div>
          </>
        )}
        
        {step === 3 && (
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <div className="position-relative">
                <Form.Control
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleInputChange}
                  onInput={(e) => {
                    blockDigitsInName(e);
                    blockEmoji(e);
                    blockSpecialCharsInName(e);
                  }}
                  isInvalid={!!errors.name}
                  isValid={validated.name}
                  required
                />
                {validated.name && (
                  <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-success">
                    ✓
                  </span>
                )}
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Only letters and spaces allowed (no numbers or special characters)
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="position-relative">
                <Form.Control
                  name="email"
                  type="email"
                  value={form.email}
                  readOnly
                  className="bg-light"
                />
                <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-success">
                  ✓ Verified
                </span>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <div className="position-relative">
                <OverlayTrigger
                  placement="bottom"
                  overlay={passwordRequirementsTooltip}
                  trigger={['hover', 'focus']}
                >
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    onInput={blockEmoji}
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => setShowPasswordRequirements(false)}
                    isInvalid={!!errors.password}
                    isValid={validated.password}
                    required
                  />
                </OverlayTrigger>
                {validated.password && (
                  <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-success">
                    ✓
                  </span>
                )}
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
              
              {/* Password requirement indicators (subtle version) */}
              <div className="mt-2">
                <div className={`password-req-indicator ${passwordTests.hasUpperCase ? "text-success" : "text-muted"}`}>
                  {passwordTests.hasUpperCase ? "✓" : "○"} Upper case
                </div>
                <div className={`password-req-indicator ${passwordTests.hasLowerCase ? "text-success" : "text-muted"}`}>
                  {passwordTests.hasLowerCase ? "✓" : "○"} Lower case
                </div>
                <div className={`password-req-indicator ${passwordTests.hasNumber ? "text-success" : "text-muted"}`}>
                  {passwordTests.hasNumber ? "✓" : "○"} Number
                </div>
                <div className={`password-req-indicator ${passwordTests.hasSpecialChar ? "text-success" : "text-muted"}`}>
                  {passwordTests.hasSpecialChar ? "✓" : "○"} Special char
                </div>
                <div className={`password-req-indicator ${passwordTests.hasMinLength ? "text-success" : "text-muted"}`}>
                  {passwordTests.hasMinLength ? "✓" : "○"} 8+ characters
                </div>
              </div>
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => setStep(2)}
                className="flex-fill"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-fill" 
                variant="primary" 
                size="lg"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
              </Button>
            </div>
          </Form>
        )}
        
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">Login</Link>
        </p>
      </Card>
    </Container>
  );
}