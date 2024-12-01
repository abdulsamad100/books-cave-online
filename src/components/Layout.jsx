import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { AuthContext } from '../context/AuthContext';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { ThemeContext } from '../context/ThemeContext';

const Layout = () => {
    const { signin } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <>
            <Toaster />
            <Header />
            <Box
                sx={{
                    transition:"0.5s",
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:  theme === 'light' ? '#000' : '#fff',
                    position: 'relative',
                    margin: "-8px",
                    overflow: 'hidden',
                }}
            >
                <Outlet />
            </Box>
            {!signin.userLoggedIn ? <Footer /> : null}
        </>
    );
};

export default Layout;
