import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../JS Files/Firebase';
import toast, { Toaster } from 'react-hot-toast';
import BookLogo from '../assets/Book-Logo.svg';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header = () => {
    const { signin } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const Signout = async () => {
        try {
            await signOut(auth);
            toast('Good Bye!', { icon: '👋', duration: 1500 });
            handleMenuClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const AuthButtons = () =>
        signin.userLoggedIn ? (
            <>
                <Link to="/dashboard" sx={{ textDecoration: 'none', cursor: "pointer" }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#000',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#fff' },
                        }}
                    >
                        Explore
                    </Button>
                </Link>

                <Link to="/add-new-book" style={{ textDecoration: 'none', cursor: "pointer" }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#000',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#fff' },
                        }}
                    >
                        Add New Book
                    </Button>
                </Link>

                <Link to="/mybooks" style={{ textDecoration: 'none', cursor: "pointer" }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#000',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#fff' },
                        }}
                    >
                        My Books
                    </Button>
                </Link>


                <IconButton onClick={handleMenuOpen}>
                    <Avatar
                        alt={signin.userLoggedIn?.displayName || 'User'}
                        src={signin.userLoggedIn?.photoURL || ''}
                        sx={{ width: 30, height: 30 }}
                    />
                </IconButton>

                <Menu
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Avatar
                            alt={signin.userLoggedIn?.displayName || 'User'}
                            src={signin.userLoggedIn?.photoURL || ''}
                            sx={{ width: 100, height: 100, border: '2px solid #fff', mb: 1 }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                            {signin.userLoggedIn?.displayName || 'User Name'}
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{
                                mt: 2,
                                borderColor: '#000',
                                color: '#000',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#fff' },
                            }}
                            onClick={Signout}
                        >
                            Signout
                        </Button>
                    </Box>
                </Menu>
            </>
        ) : (
            <>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#000',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#fff' },
                        }}
                    >
                        Signup
                    </Button>
                </Link>

                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: '#000',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': { backgroundColor: '#fff' },
                        }}
                    >
                        Login
                    </Button>
                </Link>
            </>
        );

    return (
        <AppBar
            position="absolute"
            sx={{
                top: 0,
                left: 0,
                height: '80px',
                width: '100%',
                backgroundColor: '#FFD700',
                color: '#000',
                boxShadow: 3,
                borderRadius: '0 0 16px 16px',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                justifyContent: "center"
            }}
        >
            <Toaster />
            <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={"/dashboard"} style={{ textDecoration: 'none', cursor: "pointer" }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', color: '#000', display: 'flex', alignItems: 'center', fontSize: "25px" }}
                    >
                        <img src={BookLogo} alt="Book Logo" style={{ height: '40px', marginRight: '8px' }} />
                        Online Library
                    </Typography>
                </Link>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {signin.userLoggedIn && (
                        <IconButton sx={{ color: '#000', width: "50px", '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}>
                            <ShoppingCartIcon />
                        </IconButton>
                    )}
                    <AuthButtons />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
