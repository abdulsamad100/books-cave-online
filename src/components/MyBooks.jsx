import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Modal,
    TextField,
    InputLabel,
    MenuItem,
    Select,
    FormControl,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import toast from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/material/styles";

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: theme.zIndex.modal - 9999,
}));


const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: "#fff",
    padding: theme.spacing(4),
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    margin: "auto",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
}));

const MyBooks = () => {
    const { signin } = useContext(AuthContext);
    const [myBooks, setMyBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        details: "",
        category: "",
        price: 0,
        stock: 0,
    });
    const [image, setImage] = useState(null);

    const categories = ["Fiction", "Non-Fiction", "Science", "Biography"];

    useEffect(() => {
        if (!signin?.userLoggedIn?.displayName) return;

        const booksQuery = query(
            collection(db, "books"),
            where("createdById", "==", signin.userLoggedIn.uid)
        );

        const unsubscribe = onSnapshot(
            booksQuery,
            (querySnapshot) => {
                const userBooks = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMyBooks(userBooks);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching user's books:", error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [signin?.userLoggedIn?.displayName, signin?.userLoggedIn?.uid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleEditOpen = async (id) => {
        try {
            const docRef = doc(db, "books", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data());
                setIsEditing(true);
            } else {
                toast.error("Book not found.");
            }
        } catch (error) {
            console.error("Error fetching book for edit:", error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const bookDocRef = doc(db, "books", formData.id);
            await updateDoc(bookDocRef, {
                ...formData,
                updatedAt: new Date(),
            });
            toast.success("Book updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating book:", error);
            toast.error("Failed to update the book.");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = await new Promise((resolve) => {
            toast(
                (t) => (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Are you sure you want to delete this book?
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: "#FFD700",
                                    color: "#000",
                                    "&:hover": { backgroundColor: "#FFC107" },
                                }}
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    resolve(true);
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{
                                    backgroundColor: "#ff4d4d",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#ff3333" },
                                }}
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    resolve(false);
                                }}
                            >
                                No
                            </Button>
                        </Box>
                    </>
                ),
                { duration: Infinity }
            );
        });

        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, "books", id));
                toast.success("Book deleted successfully!");
            } catch (error) {
                console.error("Error deleting book:", error);
                toast.error("Failed to delete the book. Please try again.");
            }
        } else {
            toast("Delete operation canceled.", { icon: "❌" });
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                }}
            >
                <CircularProgress sx={{ color: "#fff" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "16px" }}>
            <Modal
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                open={isEditing}
                onClose={() => setIsEditing(false)}
                BackdropComponent={StyledBackdrop}
                keepMounted
            >
                <ModalContent sx={{ width: 400 }} >
                    <form onSubmit={handleEdit}>
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
                                        <MenuItem key={formData.category} value={formData.category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Price (in Rs.)"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                type="number"
                                fullWidth
                                required
                            />
                            <TextField
                                label="Stock"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                type="number"
                                fullWidth
                            />
                            <Button variant="contained" component="label" sx={{ backgroundColor: "#FFD700", color: "#000" }}>
                                Upload Image
                                <input type="file" hidden onChange={handleImageChange} />
                            </Button>
                            {image && <Typography variant="body2">Selected Image: {image.name}</Typography>}

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: "#FFD700",
                                    color: "#000",
                                    "&:hover": { backgroundColor: "#FFC107" },
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </ModalContent>
            </Modal>

            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: "#FFD700",
                    marginTop: "80px",
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                My Books
            </Typography>

            {myBooks.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <Typography variant="h5" color="#fff">
                        You have not added any books yet.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", width: "90%", alignItems: "center" }}>
                    {myBooks.map((book) => (
                        <Card
                            key={book.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#333",
                                color: "#fff",
                                padding: "16px",
                                width: "90%"
                            }}
                        >
                            <CardMedia
                                component="img"
                                sx={{ width: "150px", height: "150px", borderRadius: "8px" }}
                                image={book.photoURL || "https://via.placeholder.com/150"}
                                alt={book.title}
                            />
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6">{book.title}</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, width: "500px", height: "40px", overflow: "hidden", }}>
                                    {book.details}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Price: Rs. {book.price}
                                </Typography>
                                <Typography variant="body2">Stock: {book.stock}</Typography>
                            </CardContent>
                            <Box>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#FFD700",
                                        color: "#000",
                                        "&:hover": { backgroundColor: "#FFC107" },
                                        mb: 1,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditOpen(book.id)
                                    }
                                    }
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#ff4d4d",
                                        color: "#fff",
                                        "&:hover": { backgroundColor: "#ff3333" },
                                    }}
                                    onClick={() => handleDelete(book.id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default MyBooks;
