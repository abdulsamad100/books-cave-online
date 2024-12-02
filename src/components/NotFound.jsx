import React, { useContext } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../context/ThemeContext";


const NotFound = () => {
  const { theme } = useContext(ThemeContext);
  const txtColor={
    transition:"0.5s",
    color: theme==="dark"?"#000":"#fff",
  }
  const txtColor2={
    transition:"0.5s",
    color: theme==="dark"?"#000":"#FFD700",
  }
  return (
    <Container>
      <Box sx={{ py: 5, textAlign: 'center', background:"none"}}>
        <Typography variant="h3" gutterBottom sx={{...txtColor2,fontWeight:"bold"}}>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1"  sx={{...txtColor,mb:"20px"}}>
          Oops! The page you are looking for does not exist. It may have been moved or deleted.
        </Typography>
        <Button variant="contained" sx={{bgcolor:"#FFD700",color:"#000"}} component={Link} to="/dashboard">
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
