import React, { useRef, useState } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../JS Files/Firebase';
import { CiCamera } from "react-icons/ci";
import uploadToCloudinary from '../JS Files/UploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';

const defaultProfilePic = "https://ufrsante.uidt.sn/wp-content/uploads/2023/09/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg";

const SignupForm = () => {
  const navigate = useNavigate();
  const formValues = useRef({
    username: '',
    email: '',
    password: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [buttonDisable, setbuttonDisable] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const signUpUser = async (ev) => {
    ev.preventDefault();
    setbuttonDisable(true);
    const loadingToastId = toast.loading('Signing Up...');
  
    if (!formValues.current.username || !formValues.current.email || !formValues.current.password) {
      toast.dismiss(loadingToastId);
      toast.error('Please fill in all fields');
      setbuttonDisable(false);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.current.email,
        formValues.current.password
      );
  
      const user = userCredential.user;
  
      // Handle profile image upload or fallback to default
      const profileImage = selectedImage 
        ? await uploadToCloudinary(selectedImage) 
        : defaultProfilePic;
  
      await updateProfile(user, {
        displayName: formValues.current.username,
        photoURL: profileImage,
      });
  
      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: formValues.current.username,
        email: formValues.current.email,
        photoURL: profileImage,
      });
  
      toast.success('Signed Up Successfully', { id: loadingToastId });
      navigate('/login');
    } catch (error) {
      setbuttonDisable(false);
      toast.dismiss(loadingToastId);
  
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
    } finally {
      setbuttonDisable(false);
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
          height: 'max-content',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
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

          <label className="flex w-[80px] h-[80px] justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition duration-300">
            <span className="text-gray-700 text-center text-[30px]"><CiCamera /></span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {selectedImage && (
            <div>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                }}
              />
            </div>
          )}


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
              disabled={buttonDisable}
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