import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Avatar
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

export default function Navbar() {
  const navigate = useNavigate();
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
  }, []);

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
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{ 
              borderBottom: '1px solid #f0f0f0',
              '&:last-child': { borderBottom: 'none' }
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isLoggedIn && (
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              borderBottom: '1px solid #f0f0f0',
              '&:last-child': { borderBottom: 'none' },
              color: 'error.main'
            }}
          >
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
        color="inherit" 
        elevation={1} 
        sx={{ 
          top: 0, 
          zIndex: 1000,
          borderBottom: '1px solid #e0e0e0'
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
            <WorkOutlineIcon sx={{ fontSize: 28, color: "#1976d2" }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: "bold", 
                color: "#333",
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              HireHub
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/" size="small">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/jobs" size="small">
              Jobs
            </Button>
            <Button color="inherit" component={Link} to="/register-company" size="small">
              Post Job
            </Button>
            
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
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
                      minWidth: 180,
                    }
                  }}
                >
                  {user && (
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user.name}
                      </Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleProfile}>
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  component={Link}
                  to="/signup"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
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
      >
        {drawerList()}
      </Drawer>
    </>
  );
}