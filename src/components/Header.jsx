import React, { useContext, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import {
  AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu,
  MenuItem, Drawer, List, ListItemButton, Box,  ListItemText, Divider,
} from '@mui/material';

import BookLogo from '../assets/Book-Logo.svg';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { auth } from '../JS Files/Firebase';
import toast from 'react-hot-toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';


const Header = () => {
  const { signin } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:750px)');
  
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const isMenuOpen = Boolean(anchorEl);
  
  const defaultProfilePic = "https://static.vecteezy.com/system/resources/previews/027/708/418/large_2x/default-avatar-profile-icon-in-flat-style-free-vector.jpg";
  
  const Signout = useCallback(async () => {
    try {
      await signOut(auth);
      toast('Good Bye!', { icon: '👋', duration: 1500 });
      handleMenuClose();
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && ['Tab', 'Shift'].includes(event.key)) return;
    setDrawerOpen(open);
  };

  return (
    <AppBar position="absolute" sx={appBarStyles}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" sx={logoStyles}>
            <img
              src={BookLogo}
              alt="Book Logo"
              style={{ height: '40px', marginRight: '8px' }}
            />
            BooksCave
          </Typography>
        </Link>
        <Box>
          {isSmallScreen ? (
            <>
              {signin.userLoggedIn && (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                  >
                    <Avatar
                      alt={signin.userLoggedIn?.displayName || 'User'}
                      src={signin.userLoggedIn?.photoURL || ''}
                      sx={{ width: 30, height: 30 }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                  >
                    <div style={{ padding: '10px', textAlign: 'center' }}>
                      <Avatar
                        src={signin?.userLoggedIn?.photoURL || defaultProfilePic}
                        alt={signin?.userLoggedIn?.displayName}
                        sx={{ width: 60, height: 60, marginBottom: 10, margin: '0 auto' }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {signin?.userLoggedIn?.displayName || "User"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'gray', marginBottom: 2 }}>
                        {signin?.userLoggedIn?.email || "User Email"}
                      </Typography>
                    </div>

                    <Divider />

                    <MenuItem onClick={Signout} sx={{ textAlign: "center" }}>Logout</MenuItem>
                  </Menu>
                </>
              )}

              <IconButton onClick={toggleDrawer(true)} sx={{ color: '#000' }}>
                <MenuIcon />
              </IconButton>

              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                  sx={{ width: 'max-content' }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '20px',
                      gap: '20px',
                      alignItems: 'end',
                    }}
                  >
                    <Box>
                      <IconButton onClick={toggleTheme} sx={{ color: '#000' }}>
                        {theme === 'light' ? <Brightness4Icon /> : <BedtimeIcon />}
                      </IconButton>
                      {signin.userLoggedIn && (
                        <>
                          <IconButton
                            sx={{ color: '#000' }}
                            onClick={() => navigate('/cart')}
                          >
                            <ShoppingCartIcon />
                          </IconButton>
                          <IconButton
                            sx={{ color: '#000' }}
                            onClick={() => navigate('/history')}
                          >
                            <HistoryIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                    {signin.userLoggedIn ? (
                      <>
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                          <Button variant="outlined" sx={buttonStyles}>
                            Explore
                          </Button>
                        </Link>
                        <Link to="/add-new-book" style={{ textDecoration: 'none' }}>
                          <Button variant="outlined" sx={buttonStyles}>
                            <AddIcon />
                          </Button>
                        </Link>
                        <Link to="/mybooks" style={{ textDecoration: 'none' }}>
                          <Button variant="outlined" sx={buttonStyles}>
                            My Books
                          </Button>
                        </Link>
                        <Button variant="outlined" sx={buttonStyles} onClick={Signout}>
                          Signout
                        </Button>
                      </>
                    ) : (
                      <>
                        <ListItemButton component={Link} to="/login">
                          <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/signup">
                          <ListItemText primary="Signup" />
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {signin.userLoggedIn && (
                <>
                  <IconButton
                    sx={{ color: '#000' }}
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: '#000' }}
                    onClick={() => navigate('/history')}
                  >
                    <HistoryIcon />
                  </IconButton>
                </>
              )}
              <IconButton onClick={toggleTheme} sx={{ color: '#000' }}>
                {theme === 'light' ? <Brightness4Icon /> : <BedtimeIcon />}
              </IconButton>
              {signin.userLoggedIn ? (
                <>
                  <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" sx={buttonStyles}>
                      Explore
                    </Button>
                  </Link>
                  <Link to="/add-new-book" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" sx={buttonStyles}>
                      <AddIcon />
                    </Button>
                  </Link>
                  <Link to="/mybooks" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" sx={buttonStyles}>
                      My Books
                    </Button>
                  </Link>
                  <Button variant="outlined" sx={buttonStyles} onClick={Signout}>
                    Signout
                  </Button>
                  <IconButton
                    onClick={handleMenuOpen}
                  >
                    <Avatar
                      alt={signin.userLoggedIn?.displayName || 'User'}
                      src={signin.userLoggedIn?.photoURL || ''}
                      sx={{ width: 30, height: 30 }}
                    />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                  >
                    <div style={{ padding: '10px', textAlign: 'center' }}>
                      <Avatar
                        src={signin?.userLoggedIn?.photoURL || defaultProfilePic}
                        alt={signin?.userLoggedIn?.displayName}
                        sx={{ width: 60, height: 60, marginBottom: 10, margin: '0 auto' }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {signin?.userLoggedIn?.displayName || "User"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'gray', marginBottom: 2 }}>
                        {signin?.userLoggedIn?.email || "User Email"}
                      </Typography>
                    </div>

                    <Divider />

                    <MenuItem onClick={Signout} sx={{ textAlign: "center" }}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" sx={buttonStyles}>
                      Signup
                    </Button>
                  </Link>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" sx={buttonStyles}>
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const appBarStyles = {
  top: 0,
  left: 0,
  height: '80px',
  width: '100%',
  backgroundColor: '#FFD700',
  color: '#000',
  boxShadow: 3,
  borderRadius: '0 0 16px 16px',
  justifyContent: 'center',
};

const logoStyles = {
  fontWeight: 'bold',
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  fontSize: '25px',
};

const buttonStyles = {
  borderColor: '#000',
  color: '#000',
  fontWeight: 'bold',
  '&:hover': { backgroundColor: '#fff' },
};

export default Header;