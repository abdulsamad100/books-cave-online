import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { collection, onSnapshot, doc, getDoc, updateDoc, setDoc, serverTimestamp, } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import Card from "./Card";
import { motion } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { signin, isLoading: authLoading } = useContext(AuthContext);
  const [firebaseData, setFirebaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const addToCart = async (userId, item) => {
    console.log("uid>>>>>", userId);
    console.log("pid>>>>>", item.id);

    try {
      // Create a reference to the product document in the 'books' collection
      const productRef = doc(db, 'books', item.id);
      const productSnapshot = await getDoc(productRef);

      console.log(productSnapshot);  // Log to see the product snapshot data

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        const currentStock = productData.stock;

        if (currentStock > 0) {
          // Update the stock in Firestore
          await updateDoc(productRef, {
            stock: currentStock - 1
          });
          const cartRef = doc(db, 'Carts', userId + "_" + item.id);

          await setDoc(cartRef, {
            createdFor: userId,
            buyerName: signin?.userLoggedIn?.displayName,
            productId: item?.id,
            productName: item?.title,
            productPrice: item?.price,
            quantity: 1,
            createdAt: serverTimestamp(),
            photoURL: item?.photoURL
          });
          toast.success('Item added to cart successfully');
          navigate("/cart")
        } else {
          toast.error("Product Out of Stock");
        }
      } else {
        console.log('Product not found! Please Reload the page');
      }
    } catch (error) {
      toast.error("Error Adding Product to Cart Please Try Again");
      console.error("Error adding product to cart: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "books"),
      (querySnapshot) => {
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFirebaseData(books);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (authLoading || isLoading) {
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
    <>
      <Toaster />
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
          Explore
        </Typography>

        {firebaseData.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Typography variant="h5" color="#fff">
              All Books Are Sold. Please Come Again Later!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {firebaseData.map((item, index) => (
              item.stock > 0 && (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.5,
                  }}
                >
                  <Card
                    cardid={item.id}
                    image={item.photoURL ?? "https://via.placeholder.com/150"}
                    title={item.title ?? "No Title"}
                    stock={item.stock ?? 0}
                    details={item.details ?? "No Details Available"}
                    price={item.price ?? 0}
                    author={item.author ?? "Unknown Author"}
                    category={item.category ?? "Uncategorized"}
                    createdAt={item.createdAt}
                    createdBy={item.createdBy}
                    photoURL={item.photoURL ?? "https://via.placeholder.com/150"}
                    onAddToCart={async (e) => {
                      e.stopPropagation();
                      const loadingToast = toast.loading("Wait While Adding to Cart")
                      await addToCart(signin.userLoggedIn.uid, item)
                      toast.dismiss();
                    }}
                  />
                </motion.div>
              )
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
