import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert, Modal, Badge, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    summary: "",
    currentTitle: ""
  });
  const [educationForm, setEducationForm] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    currentlyStudying: false,
    description: ""
  });
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    employmentType: "Full-time",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: ""
  });
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    technologies: "",
    projectUrl: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false
  });
  const [skillForm, setSkillForm] = useState({
    name: "",
    proficiency: "Intermediate"
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          location: data.user.location || "",
          summary: data.user.summary || "",
          currentTitle: data.user.currentTitle || ""
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/profile/basic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setMessage("Profile updated successfully");
        setShowEditModal(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch("http://localhost:5000/api/profile/upload-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, profilePicture: data.profilePicture });
        setMessage("Profile picture uploaded successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to upload profile picture");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://localhost:5000/api/profile/upload-resume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, resume: data.resume });
        setMessage("Resume uploaded successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to upload resume");
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `http://localhost:5000/api/profile/education/${editingItem._id}`
      : "http://localhost:5000/api/profile/education";
    
    const method = editingItem ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(educationForm),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, education: data.education });
        setMessage(`Education ${editingItem ? "updated" : "added"} successfully`);
        setShowEducationModal(false);
        setEditingItem(null);
        setEducationForm({
          degree: "",
          institution: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          currentlyStudying: false,
          description: ""
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(`Failed to ${editingItem ? "update" : "add"} education`);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `http://localhost:5000/api/profile/experience/${editingItem._id}`
      : "http://localhost:5000/api/profile/experience";
    
    const method = editingItem ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceForm),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, experience: data.experience });
        setMessage(`Experience ${editingItem ? "updated" : "added"} successfully`);
        setShowExperienceModal(false);
        setEditingItem(null);
        setExperienceForm({
          title: "",
          company: "",
          employmentType: "Full-time",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: ""
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(`Failed to ${editingItem ? "update" : "add"} experience`);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `http://localhost:5000/api/profile/projects/${editingItem._id}`
      : "http://localhost:5000/api/profile/projects";
    
    const method = editingItem ? "PUT" : "POST";

    const projectData = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(tech => tech.trim())
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, projects: data.projects });
        setMessage(`Project ${editingItem ? "updated" : "added"} successfully`);
        setShowProjectModal(false);
        setEditingItem(null);
        setProjectForm({
          name: "",
          description: "",
          technologies: "",
          projectUrl: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(`Failed to ${editingItem ? "update" : "add"} project`);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem 
      ? `http://localhost:5000/api/profile/skills/${editingItem._id}`
      : "http://localhost:5000/api/profile/skills";
    
    const method = editingItem ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillForm),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, skills: data.skills });
        setMessage(`Skill ${editingItem ? "updated" : "added"} successfully`);
        setShowSkillModal(false);
        setEditingItem(null);
        setSkillForm({
          name: "",
          proficiency: "Intermediate"
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(`Failed to ${editingItem ? "update" : "add"} skill`);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/profile/${type}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, [type]: data[type] });
        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(`Failed to delete ${type}`);
    }
  };

  const openEditModal = (type, item = null) => {
    setEditingItem(item);
    if (type === "education") {
      setEducationForm(item || {
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyStudying: false,
        description: ""
      });
      setShowEducationModal(true);
    } else if (type === "experience") {
      setExperienceForm(item || {
        title: "",
        company: "",
        employmentType: "Full-time",
        location: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: ""
      });
      setShowExperienceModal(true);
    } else if (type === "projects") {
      setProjectForm(item || {
        name: "",
        description: "",
        technologies: item ? item.technologies.join(', ') : "",
        projectUrl: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false
      });
      setShowProjectModal(true);
    } else if (type === "skills") {
      setSkillForm(item || {
        name: "",
        proficiency: "Intermediate"
      });
      setShowSkillModal(true);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-5">
        <div className="text-center">Please login to view your profile.</div>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 1200 }}>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              {user.profilePicture ? (
                <img
                  src={`http://localhost:5000/uploads/profile-pictures/${user.profilePicture}`}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: 150, height: 150, objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3 mx-auto"
                  style={{ width: 150, height: 150 }}
                >
                  <span className="text-white fs-1">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  style={{ display: "none" }}
                />
                <Button as="label" htmlFor="profilePicture" variant="outline-primary" size="sm">
                  Upload Photo
                </Button>
              </div>
              <h4 className="mt-3">{user.name}</h4>
              {user.currentTitle && <p className="text-muted">{user.currentTitle}</p>}
              {user.location && <p className="text-muted">{user.location}</p>}
              <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <h5>Skills</h5>
              {user.skills && user.skills.length > 0 ? (
                <div>
                  {user.skills.map((skill) => (
                    <Badge key={skill._id} bg="primary" className="me-1 mb-1">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p>No skills added yet.</p>
              )}
              <Button
                variant="outline-primary"
                size="sm"
                className="mt-2"
                onClick={() => openEditModal("skills")}
              >
                Add Skills
              </Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5>Resume</h5>
              {user.resume ? (
                <div>
                  <p>Resume uploaded</p>
                  <a
                    href={`http://localhost:5000/uploads/resumes/${user.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    View Resume
                  </a>
                </div>
              ) : (
                <p>No resume uploaded yet.</p>
              )}
              <div className="mt-2">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  style={{ display: "none" }}
                />
                <Button as="label" htmlFor="resume" variant="outline-primary" size="sm">
                  Upload Resume
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Profile</h4>
              </div>
              {user.summary ? (
                <p>{user.summary}</p>
              ) : (
                <p className="text-muted">No summary added yet.</p>
              )}
              <div className="row mt-3">
                <div className="col-6">
                  <strong>Email:</strong> {user.email}
                </div>
                {user.phone && (
                  <div className="col-6">
                    <strong>Phone:</strong> {user.phone}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          <Tabs defaultActiveKey="experience" className="mb-4">
            <Tab eventKey="experience" title="Experience">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Work Experience</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openEditModal("experience")}
                    >
                      Add Experience
                    </Button>
                  </div>
                  {user.experience && user.experience.length > 0 ? (
                    user.experience.map((exp) => (
                      <div key={exp._id} className="mb-3 pb-3 border-bottom">
                        <h6>{exp.title}</h6>
                        <p className="mb-1">{exp.company} • {exp.employmentType}</p>
                        <p className="text-muted mb-1">
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.currentlyWorking ? "Present" : new Date(exp.endDate).toLocaleDateString()}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                        {exp.description && <p>{exp.description}</p>}
                        <div>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal("experience", exp)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete("experience", exp._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No experience added yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="education" title="Education">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Education</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openEditModal("education")}
                    >
                      Add Education
                    </Button>
                  </div>
                  {user.education && user.education.length > 0 ? (
                    user.education.map((edu) => (
                      <div key={edu._id} className="mb-3 pb-3 border-bottom">
                        <h6>{edu.degree}</h6>
                        <p className="mb-1">{edu.institution}</p>
                        <p className="text-muted mb-1">
                          {edu.fieldOfStudy} • {edu.startYear} - {edu.currentlyStudying ? "Present" : edu.endYear}
                        </p>
                        {edu.description && <p>{edu.description}</p>}
                        <div>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal("education", edu)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete("education", edu._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No education added yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="projects" title="Projects">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Projects</h5>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openEditModal("projects")}
                    >
                      Add Project
                    </Button>
                  </div>
                  {user.projects && user.projects.length > 0 ? (
                    user.projects.map((proj) => (
                      <div key={proj._id} className="mb-3 pb-3 border-bottom">
                        <h6>{proj.name}</h6>
                        <p className="mb-1">{proj.description}</p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="mb-2">
                            <strong>Technologies:</strong>{" "}
                            {proj.technologies.map((tech, index) => (
                              <Badge key={index} bg="secondary" className="me-1">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-muted mb-1">
                          {new Date(proj.startDate).toLocaleDateString()} -{" "}
                          {proj.currentlyWorking ? "Present" : new Date(proj.endDate).toLocaleDateString()}
                        </p>
                        {proj.projectUrl && (
                          <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer">
                            View Project
                          </a>
                        )}
                        <div className="mt-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal("projects", proj)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete("projects", proj._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No projects added yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Edit Basic Info Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBasicInfoSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="currentTitle"
                    value={formData.currentTitle}
                    onChange={handleBasicInfoChange}
                    placeholder="e.g. Software Developer"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleBasicInfoChange}
                placeholder="e.g. +91 9876543210"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleBasicInfoChange}
                placeholder="e.g. Bangalore, India"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="summary"
                value={formData.summary}
                onChange={handleBasicInfoChange}
                placeholder="Write a brief summary about yourself"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Education Modal */}
      <Modal show={showEducationModal} onHide={() => setShowEducationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Education" : "Add Education"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEducationSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Degree</Form.Label>
              <Form.Control
                type="text"
                value={educationForm.degree}
                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                placeholder="e.g. Bachelor of Technology"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                value={educationForm.institution}
                onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                placeholder="e.g. ABC University"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Field of Study</Form.Label>
              <Form.Control
                type="text"
                value={educationForm.fieldOfStudy}
                onChange={(e) => setEducationForm({ ...educationForm, fieldOfStudy: e.target.value })}
                placeholder="e.g. Computer Science"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={educationForm.startYear}
                    onChange={(e) => setEducationForm({ ...educationForm, startYear: e.target.value })}
                    min="1900"
                    max="2099"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Year (or expected)</Form.Label>
                  <Form.Control
                    type="number"
                    value={educationForm.endYear}
                    onChange={(e) => setEducationForm({ ...educationForm, endYear: e.target.value })}
                    min="1900"
                    max="2099"
                    disabled={educationForm.currentlyStudying}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Currently studying here"
                checked={educationForm.currentlyStudying}
                onChange={(e) => setEducationForm({ ...educationForm, currentlyStudying: e.target.checked })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={educationForm.description}
                onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                placeholder="Describe your studies, achievements, etc."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEducationModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? "Update" : "Add"} Education
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Experience Modal */}
      <Modal show={showExperienceModal} onHide={() => setShowExperienceModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Experience" : "Add Experience"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleExperienceSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={experienceForm.title}
                onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                placeholder="e.g. Software Developer"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                value={experienceForm.company}
                onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                placeholder="e.g. ABC Technologies"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    value={experienceForm.employmentType}
                    onChange={(e) => setExperienceForm({ ...experienceForm, employmentType: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                    placeholder="e.g. Bangalore, India"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={experienceForm.endDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                    disabled={experienceForm.currentlyWorking}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="I currently work here"
                checked={experienceForm.currentlyWorking}
                onChange={(e) => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={experienceForm.description}
                onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                placeholder="Describe your responsibilities, achievements, etc."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExperienceModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? "Update" : "Add"} Experience
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Project Modal */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProjectSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Technologies (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project URL</Form.Label>
              <Form.Control
                type="url"
                value={projectForm.projectUrl}
                onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                placeholder="e.g. https://github.com/username/project"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    disabled={projectForm.currentlyWorking}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Currently working on this project"
                checked={projectForm.currentlyWorking}
                onChange={(e) => setProjectForm({ ...projectForm, currentlyWorking: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? "Update" : "Add"} Project
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Skill Modal */}
      <Modal show={showSkillModal} onHide={() => setShowSkillModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? "Edit Skill" : "Add Skill"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSkillSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                placeholder="e.g. JavaScript"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Proficiency Level</Form.Label>
              <Form.Select
                value={skillForm.proficiency}
                onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSkillModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? "Update" : "Add"} Skill
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}