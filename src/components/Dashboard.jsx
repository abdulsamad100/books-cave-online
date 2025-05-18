import React, { useContext, useEffect, useState } from "react";
import {
  Box, CircularProgress, TextField,
  Typography, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  collection, onSnapshot, orderBy,
  query, getDocs, doc, getDoc, updateDoc, addDoc
} from "firebase/firestore";
import NotFoundImg from "../assets/NotFound.png";
import { auth, db } from "../JS Files/Firebase";
import Card from "./Card";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { sigin } = useContext(AuthContext);
  const [firebaseData, setFirebaseData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const txtColor = {
    color: theme === "light" ? "#fff" : "#000",
    transition: "0.5s",
  };

  const addToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    toast.loading("Adding Item to Cart");

    try {
      const cartRef = collection(db, "Carts");
      const productRef = doc(db, "books", item.id);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        toast.dismiss();
        toast.error("The product no longer exists.");
        return;
      }

      const productData = productSnapshot.data();

      if (productData.stock <= 0) {
        toast.dismiss();
        toast.error("The product is out of stock.");
        return;
      }

      const cartItem = {
        productId: item.id,
        productName: item.title,
        productPrice: item.price,
        photoURL: item.photoURL || "https://via.placeholder.com/150",
        quantity: 1,
        createdFor: user.uid,
        createdBy: user.email,
        createdAt: new Date(),
      };

      await addDoc(cartRef, cartItem);
      await updateDoc(productRef, { stock: productData.stock - 1 });

      toast.dismiss();
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.dismiss();
      toast.error("Failed to add item to cart.");
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      toast.error("Please enter a search term.");
      setIsSearching(false);
      setDisplayedData(firebaseData);
      return;
    }

    setIsSearching(true);

    try {
      const booksRef = collection(db, "books");
      const snapshot = await getDocs(booksRef);
      const filteredResults = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const search = trimmedSearch.toLowerCase();

        const matches =
          data.title?.toLowerCase().includes(search) ||
          data.author?.toLowerCase().includes(search) ||
          data.category?.toLowerCase().includes(search) ||
          data.createdBy?.toLowerCase().includes(search);

        if (matches) {
          filteredResults.push({ id: doc.id, ...data });
        }
      });

      setSearchResults(filteredResults);
      setDisplayedData(filteredResults);

      if (filteredResults.length > 0) {
        toast.success(`${filteredResults.length} items found.`);
      } else {
        toast.info("No matching items found.");
      }
    } catch (error) {
      toast.error("Error while searching.");
      console.error("Error searching for items:", error);
    }
  };

  useEffect(() => {
    const booksRef = collection(db, "books");
    const booksQuery = query(booksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      booksQuery,
      (querySnapshot) => {
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFirebaseData(books);
        if (!isSearching) {
          setDisplayedData(books);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isSearching]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [displayedData]);

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column",
      justifyContent:"center",
      mt: "120px",
      minHeight: "calc(100vh - 120px)",
      padding: { xs: "16px", md: "24px" }
    }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          gap: "8px",
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto 32px",
        }}
      >
        <TextField
          label="Search books"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (value === "") {
              setIsSearching(false);
              setSearchResults([]);
              setDisplayedData(firebaseData);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch(e);
            }
          }}
          required
          fullWidth
          sx={{
            backgroundColor: theme === "dark" ? "#f9f9f9" : "#444",
            borderRadius: "50px",
            "& .MuiInputBase-input": {
              color: theme === "dark" ? "#000" : "#fff",
              padding: "12px 14px",
            },
            "& .MuiInputLabel-root": {
              color: theme === "dark" ? "#666" : "#aaa",
              transform: "translate(14px, 12px) scale(1)",
              "&.Mui-focused": {
                transform: "translate(14px, -9px) scale(0.75)",
                
              },
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              "& fieldset": {
                borderColor: theme === "dark" ? "#ddd" : "#666",
              },
              "&:hover fieldset": {
                borderColor: theme === "dark" ? "#bbb" : "#888",
              },
            },
          }}
        />
        <IconButton 
          onClick={handleSearch}
          sx={{
            backgroundColor: "#FFD700",
            "&:hover": {
              backgroundColor: "#fff",
            },
            borderRadius: "50%",
            padding: "12px",
          }}
        >
          <SearchIcon sx={{ 
            color: "#000",
            fontSize: "1.5rem"
          }} />
        </IconButton>
      </Box>

      {isLoading ? (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          height: "300px",
          width: "100%"
        }}>
          <CircularProgress sx={{ 
            color: theme === "dark" ? "#000" : "#fff",
            width: "60px !important",
            height: "60px !important" 
          }} />
        </Box>
      ) : (
        <Box sx={{ 
          padding: { xs: "0", md: "16px" },
          textAlign: "center",
          width: "100%",
        }}>
          {displayedData.length === 0 && isSearching ? (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              flexDirection: "column",
              padding: "40px 20px",
              textAlign: "center"
            }}>
              <img
                src={NotFoundImg}
                alt="No results found"
                style={{ 
                  width: "100%", 
                  maxWidth: "300px",
                  opacity: 0.8
                }}
              />
              <Typography variant="h5" sx={{ 
                mt: "24px", 
                ...txtColor,
                fontWeight: 500 
              }}>
                No items found for "{searchTerm}"
              </Typography>
              <Typography variant="body1" sx={{ 
                mt: "8px", 
                color: theme === "dark" ? "#666" : "#aaa",
                maxWidth: "400px"
              }}>
                Try different keywords or check for typos
              </Typography>
            </Box>
          ) : (
            <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              padding: { xs: "8px", md: "16px" },
              width: "100%",
              maxWidth: "1400px",
              margin: "0 auto",
              "& > *": {  
                width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.33% - 16px)", lg: "calc(25% - 18px)" },
                maxWidth: { sm: "calc(50% - 12px)",  md: "calc(33.33% - 16px)", lg: "calc(25% - 18px)" },
                minWidth: { xs: "280px", sm: "280px", md: "280px" }
              }
            }}
            >
              {displayedData.map((item, index) =>
                item.stock > 0 ? (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.2,
                      duration: 1,
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
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
                        addToCart(item);
                      }}
                    />
                  </motion.div>
                ) : null
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;