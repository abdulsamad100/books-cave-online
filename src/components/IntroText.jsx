import { Box, Typography, Button, Divider } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

function IntroText() {
    const { theme } = useContext(ThemeContext);
    const styles = {
        container: {
            transition:"0.5s",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: theme === 'light' ? '#121212' : '#f9f9f9',
            textAlign: 'center',
            padding: '1rem',
        },
        heading: {
            transition:"0.5s",
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: theme === 'light' ? '#FFD700' : '#333',
        },
        subText: {
            transition:"0.5s",
            fontSize: '1.25rem',
            marginBottom: '2rem',
            color: theme === 'light' ? '#fff' : '#666',
        },
        button: {
            margin: '0.5rem',
            fontWeight: 'bold',
            padding: '0.7rem 2rem',
            textTransform: 'none',
            color: '#000',
            backgroundColor: '#FFD700',
            '&:hover': {
                backgroundColor: '#FFC107',
            },
        },
        divider: {
            transition:"0.5s",
            margin: '1rem 0',
            width: '100%',
            maxWidth: '300px',
            borderColor: theme === 'light' ? '#FFD700' : '#333',
        },
    };

    return (
        <Box sx={styles.container}>
            <Typography variant="h1" component="h1" sx={styles.heading}>
                “A library is not a luxury but one of the necessities of life.”
            </Typography>
            <Typography variant="body1" sx={styles.subText}>
                Discover the magic of books. Login or signup to start your journey!
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={styles.button}>
                        Login
                    </Button>
                </Link>
                <Divider sx={styles.divider} />
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" sx={styles.button}>
                        Home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}

export default IntroText;
