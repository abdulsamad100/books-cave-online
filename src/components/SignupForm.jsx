import React, { useRef } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../JS Files/Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'; 

const SignupForm = () => {
  const navigate = useNavigate();
  const formValues = useRef({
    username: '',
    email: '',
    password: '',
  });

  const signUpUser = async (ev) => {
    ev.preventDefault();

    if (!formValues.current.username || !formValues.current.email || !formValues.current.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.current.email,
        formValues.current.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username: formValues.current.username,
        email: formValues.current.email,
      });

      toast.success('Welcome to the library!');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.message;
      if (errorMessage.includes('auth/invalid-email')) {
        toast.error('Please enter a valid email address.');
      } else if (errorMessage.includes('auth/email-already-in-use')) {
        toast.error('This email is already registered. Please log in.');
      } else if (errorMessage.includes('auth/weak-password')) {
        toast.error('Password must be at least 6 characters long.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formValues.current = { ...formValues.current, [name]: value };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }} 
      animate={{ opacity: 1, scale: .9 }} 
      transition={{ duration: 0.7, ease: 'easeInOut' }} 
    >
      <Container
        sx={{
         backgroundColor: '#fff',
          borderRadius: 4,
          boxShadow: 5,
          minWidth: 260,
          maxWidth: 1000,
          width: '300px',
          padding: 4,
          textAlign: 'center',
          zIndex: 1,
          height: '450px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', 
        }}
      >
        <Toaster />
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#2E3B55' }}
        >
          Join Our Library
        </Typography>
        <Typography
          variant="body3"
          sx={{ fontSize: '14px', color: '#6B7280' }}
        >
          Explore thousands of books and resources.
        </Typography>
        <form onSubmit={signUpUser}>
          <TextField
            fullWidth
            required
            autoComplete="off"
            label="Full Name"
            name="username"
            type="text"
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            autoComplete="off"
            label="Email"
            name="email"
            type="email"
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            autoComplete="off"
            label="Password"
            name="password"
            type="password"
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <motion.div
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 'bold',
                backgroundColor: '#FFD700',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#FFD710',
                },
              }}
            >
              Sign Up
            </Button>
          </motion.div>
        </form>
        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#666' }}
        >
          Already have an account?{' '}
          <Link
            onClick={() => navigate('/login')}
            style={{
              cursor: 'pointer',
              color: '#FFD700',
            }}
          >
            LogIn
          </Link>
        </Typography>
      </Container>
    </motion.div>
  );
};

export default SignupForm;
