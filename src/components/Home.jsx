import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h2" gutterBottom>
          Welcome to MyApp!
        </Typography>
        <Typography variant="body1" paragraph>
          This is a simple homepage for a React application using Material UI.
          You can navigate through the site using the links provided.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
