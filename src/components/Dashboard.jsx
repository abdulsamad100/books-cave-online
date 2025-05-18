import React, { useContext, useEffect, useState } from "react";
import {
  Box, CircularProgress, TextField,
  Typography, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  collection, onSnapshot, orderBy,
  query, getDocs, where,
  addDoc,
  doc,
  getDoc,
  updateDoc,
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
  const {sigin}=useContext(AuthContext)
  const [firebaseData, setFirebaseData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useContext(ThemeContext);
  const navigate=useNavigate();

  const txtColor = {
    color: theme === "light" ? "#fff" : "#000",
    transition: "0.5s",
  };

  const addToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      navigate("/login")
      return;
    }
    toast.loading("Adding Item to Cart")

    try {
      const cartRef = collection(db, "Carts");
      const productRef = doc(db, "books", item.id);

      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) {
        toast.error("The product no longer exists.");
        return;
      }

      const productData = productSnapshot.data();

      if (productData.stock <= 0) {
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

      await updateDoc(productRef, {
        stock: productData.stock - 1,
      });
      toast.dismiss()

      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart.");
    }
  };

const handleSearch = async (e) => {
  if (e) e.preventDefault(); // prevent page refresh

  const trimmedSearch = searchTerm.trim();

  if (!trimmedSearch) {
    toast.error("Please enter a search term.");
    setIsSearching(false);
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

    setFirebaseData(filteredResults);

    if (filteredResults.length > 0) {
      toast.success(`${filteredResults.length} items found.`);
    } else {
      toast.info("No matching items found.");
    }
  } catch (error) {
    toast.error("Error while searching.");
    console.error("Error searching for items:", error);
  } finally {
    setIsSearching(false);
  }
};

  useEffect(() => {
    if (!isSearching) {
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
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching books:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [isSearching]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mt: "120px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            if (e.target.value == "") {
              setIsSearching(false)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(e);
            }
          }}
          required
          sx={{
            width: "250px",
            backgroundColor: theme === "dark" ? "#f9f9f9" : "#444", borderRadius: "8px",
            "& .MuiInputBase-input": { color: theme === "dark" ? "#000" : "#fff" },
            "& .MuiInputLabel-root": { color: theme === "dark" ? "#666" : "#aaa" },
          }}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon sx={{ color: theme === "dark" ? "#000" : "#fff" }} />
        </IconButton>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "40px" }}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      )}

      {!isLoading && (
        <Box sx={{ padding: "16px", textAlign: "center" }}>
          {firebaseData.length === 0 && isSearching ? (
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
              <img src={NotFoundImg} alt="404" width={"35%"} style={{ display: "block" }}
                sx={{
                  width: { xs: "0px", sm: "50px", md: "75px", lg: "100px", },
                  display: {
                    xs: "none", lg: "block",
                  },
                }} />
              <Typography
                variant="h5"
                sx={{
                  mt: "40px",
                  ...txtColor,
                }}
              >
                No items found for your search.
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
              {firebaseData.map((item, index) =>
                item.stock > 0 ? (
                  <motion.div
                    key={item.id} initial={{ opacity: 0, y: 40 }}
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
