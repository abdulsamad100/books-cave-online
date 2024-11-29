import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import { auth } from '../JS Files/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

const LoginForm = () => {
  const { theme } = useContext(ThemeContext); 
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Signing in...');

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.dismiss(loadingToast);
      toast.success('Signed in successfully!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Email/Password is incorrect');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.6, ease: 'easeInOut' }} 
    >
      <Container
        sx={{
          backgroundColor: '#fff',
          borderRadius: 4,
          boxShadow: 5,
          minWidth: 260,
          maxWidth: 1000,
          width: '300px',
          padding: 3,
          textAlign: 'center',
          height: '350px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Toaster />
        <Typography variant="h5" gutterBottom
        sx={{ fontWeight: 'bold', color: '#2E3B55' }}
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              sx={{
                backgroundColor: theme === 'dark' ? '#555' : '#fff',
                borderRadius: '8px',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoComplete="current-password"
              sx={{
                backgroundColor: theme === 'dark' ? '#555' : '#fff',
                borderRadius: '8px',
              }}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: 'bold',
                backgroundColor: theme === 'dark' ? '#FFD700' : '#FFD700',
                color: '#000',
                '&:hover': {
                  backgroundColor: theme === 'dark' ? '#FFC400' : '#FFC400',
                },
              }}
            >
              Login
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Typography
            variant="body2"
            sx={{ mt: 2, color: theme === 'dark' ? '#aaa' : '#666' }}
          >
            Don't have an account?{' '}
            <Link
              onClick={() => navigate('/signup')}
              style={{
                cursor: 'pointer',
                color: theme === 'dark' ? '#FFD700' : '#FFD700',
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default LoginForm;
