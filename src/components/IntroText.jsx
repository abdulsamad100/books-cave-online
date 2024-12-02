import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../context/ThemeContext";
function IntroText() {
    const { theme } = useContext(ThemeContext)
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '90vw',
            background: "none",
            textAlign: 'center',
        },
        heading: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: theme === "dark" ? "#000" : "#fff"
        },
        subText: {
            fontSize: '1.25rem',
            color: theme === "dark" ? "#000" : "#fff"
        },
    };
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>“A library is not a luxury but one of the necessities of life.”</h1>
            <p style={styles.subText}>
                Discover the magic of books. Login or signup to start your journey!
            </p>
            <React.Fragment>

                <Link to={"login"}>
                    <Button
                        variant="contained"
                        color={theme === "dark" ? "#000" : "#fff"}
                        sx={{ color: "#000", backgroundColor: "#FFD700" }}
                    >
                        Login
                    </Button>
                </Link>
                <Link to={"login"}>
                    <Button
                        variant="contained"
                        color={theme === "dark" ? "#000" : "#fff"}
                        sx={{ color: "#000", backgroundColor: "#FFD700" }}
                    >
                        Login
                    </Button>
                </Link>
            </React.Fragment>
        </div>
    );
}



export default IntroText;
