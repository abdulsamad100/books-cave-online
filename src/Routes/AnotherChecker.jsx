import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AnotherChecker = () => {
    const { signin, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh' 
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {!signin.userLoggedIn ? <Navigate to="/login" /> : <Outlet />}
        </>
    );
};

export default AnotherChecker;