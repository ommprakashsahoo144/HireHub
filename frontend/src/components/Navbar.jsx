import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  IconButton, 
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BusinessIcon from "@mui/icons-material/Business";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import EmailIcon from "@mui/icons-material/Email";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('jobseeker');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const savedUserType = localStorage.getItem("userType");
    
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (savedUserType) {
        setUserType(savedUserType);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  const handleBrand = () => navigate("/");
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    
    setIsLoggedIn(false);
    setUser(null);
    setUserType('jobseeker');
    handleMenuClose();
    setDrawerOpen(false);
    
    navigate("/");
  };

  const handleProfile = () => {
    handleMenuClose();
    setDrawerOpen(false);
    navigate("/profile");
  };

  const handleDashboard = () => {
    handleMenuClose();
    setDrawerOpen(false);
    if (userType === 'recruiter') {
      navigate("/recruiter/dashboard");
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
    setDrawerOpen(false);
    if (!isLoggedIn) {
      navigate(type === 'jobseeker' ? '/login' : '/recruiter-login');
    }
  };

  // Updated menu items based on user type
  const menuItems = isLoggedIn
    ? userType === 'recruiter'
      ? [
          { text: 'Home', path: '/', icon: <PersonIcon sx={{ mr: 1.5 }} /> },
          { text: 'Jobs', path: '/jobs', icon: <WorkHistoryIcon sx={{ mr: 1.5 }} /> },
          { text: 'Recruiter Dashboard', path: '/recruiter/dashboard', icon: <DashboardIcon sx={{ mr: 1.5 }} /> },
          { text: 'Post Job', path: '/post-job', icon: <WorkOutlineIcon sx={{ mr: 1.5 }} /> },
          { text: 'Profile', path: '/profile', icon: <PersonIcon sx={{ mr: 1.5 }} /> },
        ]
      : [
          { text: 'Home', path: '/', icon: <PersonIcon sx={{ mr: 1.5 }} /> },
          { text: 'Jobs', path: '/jobs', icon: <WorkHistoryIcon sx={{ mr: 1.5 }} /> },
          { text: 'My Applications', path: '/my-applications', icon: <WorkOutlineIcon sx={{ mr: 1.5 }} /> },
          { text: 'Profile', path: '/profile', icon: <PersonIcon sx={{ mr: 1.5 }} /> },
        ]
    : [
        { text: 'Home', path: '/', icon: <PersonIcon sx={{ mr: 1.5 }} /> },
        { text: 'Jobs', path: '/jobs', icon: <WorkHistoryIcon sx={{ mr: 1.5 }} /> },
      ];

  const drawerList = () => (
    <Box
      sx={{ 
        width: 280,
        background: 'linear-gradient(135deg, #1a2a6c 0%, #2a5298 100%)',
        height: '100%',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={handleBrand} style={{cursor: 'pointer'}}>
          <WorkOutlineIcon sx={{ fontSize: 28, color: "#4fc3f7" }} />
          <Typography variant="h6" component="div">
            HireHub
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info Section - Show when logged in */}
      {isLoggedIn && user && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: '#4fc3f7',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                {user.email}
              </Typography>
              <Typography variant="caption" sx={{ color: '#4fc3f7' }}>
                {userType === 'recruiter' ? 'Recruiter' : 'Jobseeker'}
              </Typography>
            </Box>
          </Box>
          
          {/* Notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: 'white' }}>
              <Badge badgeContent={3} color="error">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <Typography variant="body2">Notifications</Typography>
          </Box>
        </Box>
      )}

      {/* User Type Selection */}
      {!isLoggedIn && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#4fc3f7' }}>
            I am a:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant={userType === 'jobseeker' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleUserTypeSelect('jobseeker')}
              sx={{ 
                flex: 1,
                backgroundColor: userType === 'jobseeker' ? '#4fc3f7' : 'transparent',
                borderColor: '#4fc3f7',
                color: userType === 'jobseeker' ? 'white' : '#4fc3f7',
                '&:hover': {
                  backgroundColor: userType === 'jobseeker' ? '#29b6f6' : 'rgba(79, 195, 247, 0.1)'
                }
              }}
            >
              Jobseeker
            </Button>
            <Button 
              variant={userType === 'recruiter' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleUserTypeSelect('recruiter')}
              sx={{ 
                flex: 1,
                backgroundColor: userType === 'recruiter' ? '#4fc3f7' : 'transparent',
                borderColor: '#4fc3f7',
                color: userType === 'recruiter' ? 'white' : '#4fc3f7',
                '&:hover': {
                  backgroundColor: userType === 'recruiter' ? '#29b6f6' : 'rgba(79, 195, 247, 0.1)'
                }
              }}
            >
              Recruiter
            </Button>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => {
                navigate(item.path);
                setDrawerOpen(false);
              }}
              sx={{ 
                py: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: location.pathname === item.path ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                color: location.pathname === item.path ? '#4fc3f7' : 'white'
              }}
            >
              {item.icon}
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 600 : 400 
                }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Auth Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {!isLoggedIn ? (
          <>
            <Button 
              fullWidth
              variant="outlined"
              onClick={() => {
                setDrawerOpen(false);
                navigate(userType === 'jobseeker' ? '/login' : '/recruiter-login');
              }}
              sx={{ 
                mb: 1,
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Login
            </Button>
            <Button 
              fullWidth
              variant="contained"
              onClick={() => {
                setDrawerOpen(false);
                navigate(userType === 'jobseeker' ? '/signup' : '/recruiter-signup');
              }}
              sx={{ 
                background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #29b6f6 0%, #03a9f4 100%)'
                }
              }}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <Button 
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderColor: '#ff5252',
              color: '#ff5252',
              '&:hover': {
                borderColor: '#ff5252',
                backgroundColor: 'rgba(255,82,82,0.1)'
              }
            }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={4} 
        sx={{ 
          top: 0, 
          zIndex: 1300,
          background: 'linear-gradient(135deg, #1a2a6c 0%, #2a5298 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          px: { xs: 1, sm: 3 },
          py: 1
        }}>
          {/* Brand */}
          <Box
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1, 
              cursor: "pointer" 
            }}
            onClick={handleBrand}
          >
            <WorkOutlineIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: "#4fc3f7" }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: "bold", 
                color: "white",
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              HireHub
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {/* User Type Selection for non-logged in users */}
            {!isLoggedIn && (
              <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
                <Button 
                  variant={userType === 'jobseeker' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleUserTypeSelect('jobseeker')}
                  startIcon={<PersonIcon />}
                  sx={{ 
                    backgroundColor: userType === 'jobseeker' ? '#4fc3f7' : 'transparent',
                    borderColor: '#4fc3f7',
                    color: userType === 'jobseeker' ? 'white' : '#4fc3f7',
                    '&:hover': {
                      backgroundColor: userType === 'jobseeker' ? '#29b6f6' : 'rgba(79, 195, 247, 0.1)'
                    }
                  }}
                >
                  Jobseeker
                </Button>
                <Button 
                  variant={userType === 'recruiter' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleUserTypeSelect('recruiter')}
                  startIcon={<BusinessIcon />}
                  sx={{ 
                    backgroundColor: userType === 'recruiter' ? '#4fc3f7' : 'transparent',
                    borderColor: '#4fc3f7',
                    color: userType === 'recruiter' ? 'white' : '#4fc3f7',
                    '&:hover': {
                      backgroundColor: userType === 'recruiter' ? '#29b6f6' : 'rgba(79, 195, 247, 0.1)'
                    }
                  }}
                >
                  Recruiter
                </Button>
              </Box>
            )}

            <Button 
              color="inherit" 
              component={Link} 
              to="/" 
              size="small"
              sx={{ 
                color: location.pathname === '/' ? '#4fc3f7' : 'white',
                backgroundColor: location.pathname === '/' ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                fontWeight: location.pathname === '/' ? 600 : 400,
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/jobs" 
              size="small"
              sx={{ 
                color: location.pathname === '/jobs' ? '#4fc3f7' : 'white',
                backgroundColor: location.pathname === '/jobs' ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                fontWeight: location.pathname === '/jobs' ? 600 : 400,
                borderRadius: 2,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Jobs
            </Button>
            
            {isLoggedIn ? (
              <>
                {/* Recruiter Specific Links */}
                {userType === 'recruiter' ? (
                  <>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/recruiter/dashboard" 
                      size="small"
                      startIcon={<DashboardIcon />}
                      sx={{ 
                        color: location.pathname === '/recruiter/dashboard' ? '#4fc3f7' : 'white',
                        backgroundColor: location.pathname === '/recruiter/dashboard' ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                        fontWeight: location.pathname === '/recruiter/dashboard' ? 600 : 400,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/post-job" 
                      size="small"
                      sx={{ 
                        color: location.pathname === '/post-job' ? '#4fc3f7' : 'white',
                        backgroundColor: location.pathname === '/post-job' ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                        fontWeight: location.pathname === '/post-job' ? 600 : 400,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Post Job
                    </Button>
                  </>
                ) : (
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/my-applications" 
                    size="small"
                    sx={{ 
                      color: location.pathname === '/my-applications' ? '#4fc3f7' : 'white',
                      backgroundColor: location.pathname === '/my-applications' ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                      fontWeight: location.pathname === '/my-applications' ? 600 : 400,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    My Applications
                  </Button>
                )}
                
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                  <Avatar sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      }
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {user && (
                    <MenuItem disabled sx={{ opacity: 1, py: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 14 }} /> {user.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main' }}>
                          {userType === 'recruiter' ? 'Recruiter' : 'Jobseeker'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  )}
                  <Divider />
                  {userType === 'recruiter' && (
                    <MenuItem onClick={handleDashboard} sx={{ py: 1.5 }}>
                      <DashboardIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                    <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to={userType === 'jobseeker' ? '/login' : '/recruiter-login'}
                  size="small"
                  sx={{ 
                    ml: 1,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  component={Link}
                  to={userType === 'jobseeker' ? '/signup' : '/recruiter-signup'}
                  size="small"
                  sx={{ 
                    ml: 1,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #29b6f6 0%, #03a9f4 100%)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.25)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1 }}>
            {isLoggedIn && (
              <>
                <IconButton color="inherit" size="small">
                  <Badge badgeContent={3} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main',
                    border: '2px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer'
                  }}
                  onClick={userType === 'recruiter' ? handleDashboard : handleProfile}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
                </Avatar>
              </>
            )}
            <IconButton
              sx={{ color: 'white' }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawerList()}
      </Drawer>
    </>
  );
}