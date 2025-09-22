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

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]); // Re-run when location changes to update login status

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
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    handleMenuClose();
    
    // Redirect to login page
    navigate("/login");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const menuItems = isLoggedIn
    ? [
        { text: 'Home', path: '/' },
        { text: 'Jobs', path: '/jobs' },
        { text: 'Post Job', path: '/register-company' },
      ]
    : [
        { text: 'Home', path: '/' },
        { text: 'Jobs', path: '/jobs' },
        { text: 'Post Job', path: '/register-company' },
        { text: 'Login', path: '/login' },
        { text: 'Sign Up', path: '/signup' },
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
        {isLoggedIn && (
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
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}>
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
            <Button 
              color="inherit" 
              component={Link} 
              to="/register-company" 
              size="small"
              sx={{ 
                color: location.pathname === '/register-company' ? '#4fc3f7' : 'white',
                backgroundColor: location.pathname === '/register-company' ? 'rgba(79, 195, 247, 0.15)' : 'transparent',
                fontWeight: location.pathname === '/register-company' ? 600 : 400,
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
            
            {isLoggedIn ? (
              <>
                <IconButton color="inherit" sx={{ ml: 1 }}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsNoneIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
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
                  to="/login"
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
                  to="/signup"
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