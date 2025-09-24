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
  Badge
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BusinessIcon from "@mui/icons-material/Business";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('jobseeker'); // 'jobseeker' or 'recruiter'
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
    
    navigate("/");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type);
    if (!isLoggedIn) {
      navigate(type === 'jobseeker' ? '/login' : '/recruiter-login');
    }
  };

  const menuItems = isLoggedIn
    ? [
        { text: 'Home', path: '/' },
        { text: 'Jobs', path: '/jobs' },
        { text: userType === 'recruiter' ? 'Post Job' : 'My Applications', path: userType === 'recruiter' ? '/post-job' : '/my-applications' },
      ]
    : [
        { text: 'Home', path: '/' },
        { text: 'Jobs', path: '/jobs' },
      ];

  const drawerList = () => (
    <Box
      sx={{ 
        width: 280,
        background: 'linear-gradient(135deg, #1a2a6c 0%, #2a5298 100%)',
        height: '100%',
        color: 'white'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkOutlineIcon sx={{ fontSize: 28, color: "#4fc3f7" }} />
          <Typography variant="h6" component="div">
            HireHub
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
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

      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
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
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: location.pathname === item.path ? 600 : 400 
              }} 
            />
          </ListItem>
        ))}
        
        {!isLoggedIn ? (
          <>
            <ListItem 
              button 
              component={Link} 
              to={userType === 'jobseeker' ? '/login' : '/recruiter-login'}
              sx={{ 
                py: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: location.pathname.includes('/login') ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                color: location.pathname.includes('/login') ? '#4fc3f7' : 'white'
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to={userType === 'jobseeker' ? '/signup' : '/recruiter-signup'}
              sx={{ 
                py: 1.5,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                backgroundColor: location.pathname.includes('/signup') ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                color: location.pathname.includes('/signup') ? '#4fc3f7' : 'white'
              }}
            >
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        ) : (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              py: 1.5,
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: '#ff5252',
              '&:hover': {
                backgroundColor: 'rgba(255,82,82,0.1)'
              }
            }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
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
          px: { xs: 2, sm: 3 },
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
            <WorkOutlineIcon sx={{ fontSize: 32, color: "#4fc3f7" }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: "bold", 
                color: "white",
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
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
                {userType === 'recruiter' ? (
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
                    <MenuItem disabled sx={{ opacity: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {user.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main' }}>
                          {userType === 'recruiter' ? 'Recruiter' : 'Jobseeker'}
                        </Typography>
                      </Box>
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
          <IconButton
            sx={{ 
              display: { xs: "flex", md: "none" },
              color: 'white'
            }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent'
          }
        }}
      >
        {drawerList()}
      </Drawer>
    </>
  );
}