import React, { useContext, useRef, useState } from 'react';
import { Container, TextField, Button, Typography, Link } from '@mui/material';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../JS Files/Firebase';
import { CiCamera } from "react-icons/ci";
import uploadToCloudinary from '../JS Files/UploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const defaultProfilePic = "https://static.vecteezy.com/system/resources/previews/027/708/418/large_2x/default-avatar-profile-icon-in-flat-style-free-vector.jpg";



const SignupForm = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const formValues = useRef({ username: '', email: '', password: '' });
  const { theme } = useContext(ThemeContext);
  const styles = {
    container: {
      bgcolor: theme === 'light' ? '#333' : '#fff',
      borderRadius: 4,
      boxShadow: 5,
      p: 4,
      textAlign: 'center',
      height: 'max-content',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '320px',
      transform: 'translate(-50%, -50%)',
    },
    title: {
      fontWeight: 'bold',
      color: theme === 'light' ? '#FFD700' : '#000',
    },
    subtitle: {
      color: theme === 'light' ? '#fff' : '#000',
      mb: 2,
    },
    textField: {
      margin: 'normal',
      variant: 'outlined',
      fullWidth: true,
      required: true,
    },
    button: {
      mt: 2,
      py: 1.5,
      fontWeight: 'bold',
      bgcolor: '#FFD700',
      color: '#000',
      '&:hover': { bgcolor: '#FFD710' },
    },
    link: {
      cursor: 'pointer',
      color: theme === 'dark' ? '#000' : '#FFD700',
    },
  };
  const textFieldStyles = {
    containerBg: theme === 'light' ? '#333' : '#fff',
    textFieldBg: theme === 'light' ? '#444' : '#f9f9f9',
    textColor: theme === 'light' ? '#fff' : '#000',
    labelColor: theme === 'light' ? '#aaa' : '#666',
    buttonBg: '#FFD700',
    buttonTextColor: '#000',
  };

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
    console.log(formValues.current);

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
      <Container sx={styles.container}>
        <Typography variant="h5" sx={styles.title}>Join Our Library</Typography>
        <Typography variant="body2" sx={styles.subtitle}>Explore thousands of books and resources.</Typography>

        <form onSubmit={signUpUser}>
          <ImageUploader />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', margin: '10px auto', color: styles.subtitle.color }}
            />
          )}

          {['User Name', 'Email', 'Password'].map((label, index) => (
            <TextField
              key={index}
              {...styles.textField}
              label={label}
              name={label.toLowerCase().replace(' ', '')}
              type={label === 'Password' ? 'password' : 'text'}
              onChange={handleInputChange}
              sx={{
                backgroundColor: textFieldStyles.textFieldBg,
                borderRadius: '8px',
                '& .MuiInputBase-input': {
                  color: textFieldStyles.textColor,
                },
                '& .MuiInputLabel-root': {
                  color: textFieldStyles.labelColor,
                },
              }}
              autoComplete=''
            />
          ))}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              fullWidth
              disabled={buttonDisabled}
              variant="contained"
              sx={styles.button}
            >
              Sign Up
            </Button>
          </motion.div>
        </form>

        <Typography variant="body2" sx={{ mt: 2, color: styles.subtitle.color }}>
          Already have an account?{' '}
          <Link onClick={() => navigate('/login')} sx={styles.link}>
            Log In
          </Link>
        </Typography>
      </Container>
    </motion.div>
  );
};

export default SignupForm;