import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card as MuiCard,
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
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { collection, onSnapshot, deleteDoc, doc, query, where, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import toast from "react-hot-toast";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const MyBooks = () => {
    const { signin } = useContext(AuthContext);
    const [myBooks, setMyBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "books", id));
            toast.success("Book deleted successfully!");
        } catch (error) {
            console.error("Error deleting book:", error);
            toast.error("Failed to delete the book.");
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
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}
                >
                    {myBooks.map((book) => (
                        <motion.div key={book.id} variants={cardVariants}>
                            <MuiCard
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "#333",
                                    color: "#fff",
                                    height: "140px",
                                    padding: "16px",
                                    width: "max-content",
                                    borderRadius: "15px",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ width: "135px", height: "135px", borderRadius: "10px" }}
                                    image={book.photoURL || "https://via.placeholder.com/150"}
                                    alt={book.title}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6">{book.title}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        {book.author}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            opacity: 0.8,
                                            width: "25vw",
                                            height: "40px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {book.details}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Price: Rs. {book.price}
                                    </Typography>
                                    <Typography variant="body2">Stock: {book.stock}</Typography>
                                </CardContent>
                                <Box sx={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#FFD700",
                                            color: "#000",
                                            "&:hover": { backgroundColor: "#FFC107" },
                                            mb: 1,
                                        }}
                                        onClick={() => console.log("Edit book", book.id)}
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
                            </MuiCard>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </Box>
    );
};

export default MyBooks;
