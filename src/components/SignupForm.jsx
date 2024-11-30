import React, { useRef, useState } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../JS Files/Firebase';
import { CiCamera } from "react-icons/ci";
import uploadToCloudinary from '../JS Files/UploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const defaultProfilePic = "https://ufrsante.uidt.sn/wp-content/uploads/2023/09/default-avatar-profile-icon-vector-social-media-user-photo-700-205577532.jpg";

const SignupForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const formValues = useRef({ username: '', email: '', password: '' });

  const handleInputChange = (e) => {
    formValues.current = { ...formValues.current, [e.target.name]: e.target.value };
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const signUpUser = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);
    const loadingToastId = toast.loading('Signing Up...');
    const { username, email, password } = formValues.current;

    if (!username || !email || !password) {
      toast.dismiss(loadingToastId);
      toast.error('Please fill in all fields');
      setButtonDisabled(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const profileImage = selectedImage ? await uploadToCloudinary(selectedImage) : defaultProfilePic;

      await updateProfile(user, { displayName: username, photoURL: profileImage });
      await setDoc(doc(db, 'users', user.uid), { username, email, photoURL: profileImage });

      toast.success('Signed Up Successfully', { id: loadingToastId });
      navigate('/login');
    } catch (error) {
      handleErrors(error, loadingToastId);
    } finally {
      setButtonDisabled(false);
    }
  };

  const handleErrors = (error, loadingToastId) => {
    toast.dismiss(loadingToastId);
    if (error.message.includes('auth/invalid-email')) toast.error('Invalid email address.');
    else if (error.message.includes('auth/email-already-in-use')) toast.error('Email already in use.');
    else if (error.message.includes('auth/weak-password')) toast.error('Password must be at least 6 characters.');
    else if (error.message.includes('upload profile image')) toast.error('Profile image upload failed.');
    else toast.error('An error occurred. Try again.');
  };

  const ImageUploader = () => (
    <label className="flex w-[80px] h-[80px] border-2 border-dashed rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition">
      <CiCamera className="text-[30px]" />
      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
    </label>
  );

  return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 0.9 }} transition={{ duration: 0.7 }}>
      <Container
        sx={{
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 5,
          p: 4,
          textAlign: 'center',
          height: 'max-content',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: {
            xs: '90vw',
            sm: '80vw',
            md: '60vw',
            lg: '40vw',
            xl: '20vw',
          },
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2E3B55' }}>Join Our Library</Typography>
        <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>Explore thousands of books and resources.</Typography>

        <form onSubmit={signUpUser}>
          <ImageUploader />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', margin: '10px auto' }}
            />
          )}

          {['Full Name', 'Email', 'Password'].map((label, index) => (
            <TextField
              key={index}
              fullWidth
              required
              label={label}
              name={label.toLowerCase().replace(' ', '')}
              type={label === 'Password' ? 'password' : 'text'}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
          ))}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              fullWidth
              disabled={buttonDisabled}
              variant="contained"
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold', bgcolor: '#FFD700', color: '#000', '&:hover': { bgcolor: '#FFD710' } }}
            >
              Sign Up
            </Button>
          </motion.div>
        </form>

        <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
          Already have an account?{' '}
          <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer', color: '#FFD700' }}>
            Log In
          </Link>
        </Typography>
      </Container>
    </motion.div>
  );
};

export default SignupForm;
