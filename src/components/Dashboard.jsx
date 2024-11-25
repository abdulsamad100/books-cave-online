import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import Card from "./Card";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { signin, isLoading: authLoading } = useContext(AuthContext);
  const [firebaseData, setFirebaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
                  onAddToCart={(e) => {
                    e.stopPropagation();
                    alert(`${item.title} added to cart!`);
                  }}
                />
              </motion.div>
            )
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
