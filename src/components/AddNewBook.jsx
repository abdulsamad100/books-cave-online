import React, { useContext, useState, useEffect } from "react";
import {
    TextField, Button, Container,  Typography, Box, CircularProgress,
    MenuItem, Select, InputLabel, FormControl,
} from "@mui/material";
import uploadToCloudinary from "../JS Files/UploadToCloudinary";
import { db } from "../JS Files/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const AddNewBook = () => {
    const { signin } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [formData, setFormData] = useState({
        title: "", author: "", details: "",
        category: "", price: "", stock: "",
    });
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const categories = [
        "Novel", "Islamic", "Fiction", "Non-Fiction", "Science",
        "History", "Technology", "Art", "Biography", "Others",
    ];

    const styles = {
        container: {
            scale: 0.9,
            width: "50vw",
            minWidth: "350px",
            padding: "25px",
            mb: 0,
            mt: "100px",
            bgcolor: theme === "dark" ? "#fff" : "#333",
            borderRadius: "10px",
            boxShadow: "0px 0px 15px 1px rgba(0,0,0,0.3)",
        },
        title: {
            mb: 3,
            fontWeight: "bold",
            textAlign: "center",
            color: theme === "dark" ? "#333" : "#FFD700",
        },
        button: {
            backgroundColor: "#FFD700",
            color: "#000",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#FFC107" },
        },
        textField: {
            backgroundColor: theme === "dark" ? "#f9f9f9" : "#444",
            borderRadius: "8px",
            "& .MuiInputBase-input": { color: theme === "dark" ? "#000" : "#fff" },
            "& .MuiInputLabel-root": { color: theme === "dark" ? "#666" : "#aaa" },
        },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image || !formData.title || !formData.price || !formData.category) {
            toast.error("Please fill all required fields and upload an image.");
            return;
        }
        setIsLoading(true);
        const loadingToastId = toast.loading("Uploading Book...");
        try {
            const imageUrl = await uploadToCloudinary(image);
            if (!imageUrl) throw new Error("Image upload failed");
            const bookData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10) || 0,
                photoURL: imageUrl,
                createdAt: serverTimestamp(),
                createdBy: signin.userLoggedIn.displayName,
                createdById: signin.userLoggedIn.uid,
            };
            await addDoc(collection(db, "books"), bookData);
            toast.success("Book added successfully!", { id: loadingToastId });
            setFormData({
                title: "", author: "", details: "",
                category: "", price: "", stock: "",
            });
            setImage(null);
            navigate("/mybooks");
        } catch (error) {
            toast.error("Failed to add book. Please try again.", { id: loadingToastId });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    return (
        <motion.div initial={{ opacity: 0, scaleX: 0, }} animate={{ opacity: 1, scaleX: 0.9, }} transition={{ duration: 0.7 }}>
            <Container sx={styles.container}>
                <Typography variant="h4" sx={styles.title}>
                    Add New Book
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            sx={styles.textField}
                        />
                        <TextField
                            label="Author"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            fullWidth
                            sx={styles.textField}
                        />
                        <TextField
                            label="Details"
                            name="details"
                            value={formData.details}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            fullWidth
                            sx={styles.textField}
                        />
                        <FormControl fullWidth required>
                            <InputLabel sx={{ color: styles.textField["& .MuiInputLabel-root"].color }}>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                sx={styles.textField}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            type="number"
                            fullWidth
                            sx={styles.textField}
                        />
                        <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                            <TextField
                                label="Price (in Rs.)"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                type="number"
                                sx={{ ...styles.textField, width: "33vw" }}
                                required
                            />
                            <Button variant="contained" component="label" sx={styles.button}>
                                Upload Image
                                <input type="file" hidden onChange={handleImageChange} />
                            </Button>
                        </Box>
                        {image && <Typography variant="body2">Selected Image: {image.name}</Typography>}

                        <Button type="submit" variant="contained" disabled={isLoading} sx={styles.button}>
                            {isLoading ? <CircularProgress size={24} sx={{ color: "#000" }} /> : "Add Book"}
                        </Button>
                    </Box>
                </form>
            </Container>
        </motion.div>
    );
};

export default AddNewBook;