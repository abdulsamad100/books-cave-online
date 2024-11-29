import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card as MuiCard,
    CardContent,
    CardMedia,
    CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../JS Files/Firebase";
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

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        const cartQuery = query(
            collection(db, "Carts"),
            where("createdFor", "==", user.uid)
        );

        const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    ...data,
                });
            });
            console.log("Cart Items:", items);
            setCartItems(items);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDelete = async (itemId, productId) => {
        try {
            const productRef = doc(db, "books", productId);
            const productSnapshot = await getDoc(productRef);

            if (productSnapshot.exists()) {
                const productData = productSnapshot.data();
                const currentStock = productData.stock;

                await updateDoc(productRef, {
                    stock: currentStock + 1,
                });
            }

            await deleteDoc(doc(db, "Carts", itemId));
            toast.success("Item removed from cart and stock updated!");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to remove the item.");
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
                <CircularProgress />
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
                My Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <Typography variant="h5" sx={{ color: "white" }}>
                        Your cart is empty.
                    </Typography>
                </Box>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        alignItems: "center",
                    }}
                >
                    {cartItems.map((item) => (
                        <motion.div key={item.id} variants={cardVariants}>
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
                                    sx={{
                                        width: "135px",
                                        height: "135px",
                                        borderRadius: "10px",
                                    }}
                                    image={item.photoURL || "https://via.placeholder.com/150"}
                                    alt={item.productName || "Product"}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6">{item.productName}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        Price: Rs. {item.productPrice}
                                    </Typography>
                                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                </CardContent>
                                <Box sx={{ marginLeft: "20px" }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#ff4d4d",
                                            color: "#fff",
                                            "&:hover": { backgroundColor: "#ff3333" },
                                        }}
                                        onClick={() => handleDelete(item.id, item.productId)}
                                    >
                                        Remove
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

export default Cart;
