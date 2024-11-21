import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#FFD700',
        color: 'black',
        py: 2,
        textAlign: 'center',
        borderRadius: '16px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1300,
        height:"15px"
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} OnlineLibrary. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
