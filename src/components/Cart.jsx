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
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingItemId, setRemovingItemId] = useState(null);
    const user = auth.currentUser;
    const navigate = useNavigate()

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
            setCartItems(items);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDelete = async (itemId, productId) => {
        setRemovingItemId(itemId);
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
            toast.success("Item removed from Cart!");
        } catch (error) {
            console.error("Error deleting item:", error);

            toast.error("Failed to remove the item. Try Reloading");
        } finally {
            setRemovingItemId(null);
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
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        alignItems: "center",
                    }}
                >
                    {cartItems.map((item) => (
                        <motion.div key={item.id}>
                            <MuiCard
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
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
                                        disabled={removingItemId === item.id}
                                    >
                                        {removingItemId === item.id ? "Removing..." : "Remove"}
                                    </Button>
                                </Box>
                            </MuiCard>
                        </motion.div>
                    ))}

                    {/* Center the Proceed to Payment button */}
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "20px" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/bill")}
                            sx={{
                                color: "#000",
                                backgroundColor: "#FFD700",
                                fontWeight: "bold",
                                fontSize: "13px",
                                alignItems: "center",
                                textAlign: "center",
                                cursor:"pointer"
                            }}
                        >
                            Proceed to Payment
                        </Button>
                    </Box>
                </motion.div>
            )}
        </Box>

    );
};

export default Cart;
