import React, { useContext, useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Box, CircularProgress, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import uploadToCloudinary from "../JS Files/UploadToCloudinary";
import { db } from "../JS Files/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddNewBook = () => {
    const { signin } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        details: "",
        category: "",
        price: "",
        stock: "",
    });
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const categories = ["Novel", "Islamic", "Fiction", "Non-Fiction", "Science", "History", "Technology", "Art", "Biography", "Others"];

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
            console.log("Uploading image...");
            const imageUrl = await uploadToCloudinary(image);
            if (!imageUrl) throw new Error("Image upload failed");

            console.log("Image uploaded, saving book...");
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
            console.log("Book added:", bookData);

            setFormData({
                title: "",
                author: "",
                details: "",
                category: "",
                price: "",
                stock: "",
            });
            setImage(null);
            navigate("/mybooks");
        } catch (error) {
            console.error("Submission failed:", error.message);
            toast.error("Failed to add book. Please try again.", { id: loadingToastId });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Cleanup toast notifications when the component unmounts
        return () => {
            toast.dismiss();  // Dismiss any active toasts when navigating away from the page
        };
    }, []);

    return (
        <Container sx={{scale:0.9, width: "50vw", minWidth: "280px", padding: "25px", mb: 0, mt: "100px", bgcolor: "#fff", borderRadius: "10px" }}>
            <Toaster />
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
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
                    />
                    <TextField
                        label="Author"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Details"
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <FormControl fullWidth required>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
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
                    />
                    <Box sx={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                        <TextField
                            label="Price (in Rs.)"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            type="number"
                            sx={{ width: "33vw" }}
                            required
                        />
                        <Button variant="contained" component="label" sx={{ backgroundColor: "#FFD700", color: "#000", height: "50px" }}>
                            Upload Image
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                    </Box>
                    {image && <Typography variant="body2">Selected Image: {image.name}</Typography>}

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            backgroundColor: "#FFD700",
                            color: "#000",
                            "&:hover": { backgroundColor: "#FFC107" },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} sx={{ color: "#000" }} /> : "Add Book"}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default AddNewBook;
