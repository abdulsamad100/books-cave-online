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
    console.log(signin);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const Signout = async () => {
        try {
            await signOut(auth);
            toast('Good Bye!', {
                icon: '👋',
                duration: 1500,
            });
            handleMenuClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <AppBar
            position="absolute"
            sx={{
                top: 0,
                left: 0,
                height: "60px",
                width: '100%',
                backgroundColor: '#FFD700',
                color: '#000',
                boxShadow: 3,
                zIndex: 10,
                borderRadius: '0 0 16px 16px',
                transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
        >
            <Toaster />
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#000', display: "flex", alignItems: "center" }}>
                    <img src={BookLogo} alt="Book Logo" style={{ height: '30px', marginRight: '8px' }} />
                    Online Library
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {signin.userLoggedIn && (
                        <IconButton
                            sx={{
                                color: '#000',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                            }}
                        >
                            <ShoppingCartIcon />
                        </IconButton>
                    )}

                    {!signin.userLoggedIn ? (
                        <>
                            <Link style={{ textDecoration: 'none' }} to="/signup">
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#000',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                >
                                    Signup
                                </Button>
                            </Link>
                            <Link style={{ textDecoration: 'none' }} to="/login">
                                <Button
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#000',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: '#fff',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: '#000',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#fff',
                                    },
                                }}
                                onClick={() => {
                                    console.log("Add A Book clicked!");
                                }}
                            >
                                My Books
                            </Button>

                            <IconButton onClick={handleMenuOpen}>
                                <Avatar
                                    alt={signin.userLoggedIn?.displayName || "User"}
                                    src={signin.userLoggedIn?.photoURL || ""}
                                    sx={{ width: 30, height: 30 }}
                                />
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                sx={{ mt: 2 }}
                            >
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                    <Avatar
                                        alt={signin.userLoggedIn?.displayName || "User"}
                                        src={signin.userLoggedIn?.photoURL || ""}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            border: '2px solid #fff',
                                            marginBottom: 1 
                                        }}
                                    />
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                                        {signin?.username || "User Name"}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            mt: 2,
                                            borderColor: '#000',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: '#fff',
                                            },
                                        }}
                                        onClick={Signout}
                                    >
                                        Signout
                                    </Button>
                                </Box>
                            </Menu>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
