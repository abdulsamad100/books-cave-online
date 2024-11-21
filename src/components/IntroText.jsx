import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function IntroText() {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>“A library is not a luxury but one of the necessities of life.”</h1>
            <p style={styles.subText}>
                Discover the magic of books. Login or signup to start your journey!
            </p>
            <Link to={"login"}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ color: "#000", backgroundColor: "#FFD700" }}
                >
                    Login
                </Button>
            </Link>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000',
        color: 'white',
        textAlign: 'center',
    },
    heading: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    subText: {
        fontSize: '1.25rem',
    },
};

export default IntroText;
