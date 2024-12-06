import { useEffect, useState, useContext } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography, CircularProgress, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";


const History = () => {
  const { signin } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const current_uid = signin?.userLoggedIn?.uid;

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchBar=()=>{
    return(
      <TextField
      value={searchText}
      onChange={handleInputChange}
      placeholder="Search..."
      variant="outlined"
      fullWidth
      sx={{ maxWidth: '500px' }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>
        ),
        endAdornment: (
          searchText && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        ),
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      }}
    />
    )
  }

  useEffect(() => {
    if (!current_uid) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "History"),
        where("userId", "==", current_uid),
        orderBy("paymentDate", "desc")
      ),
      (snapshot) => {
        setHistoryItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [current_uid]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 4,
            color: theme === "dark" ? "#333" : "#FFD700",
          }}
        >
          Purchase History
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress />
          </Box>
        ) : historyItems.length ? (
          <>
            {historyItems.map((item) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", mt: 4, justifyContent: "center", alignItems: "center" }} key={item.id}>
                <Card
                  sx={{
                    backgroundColor: theme === "light" ? "#f5f5f5" : "#1a1a1a",
                    color: theme === "light" ? "#333" : "#fff",
                    width: "max-content"
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.cartItems[0].photoURL || "/placeholder.jpg"}
                    alt={item.productName || "Product Image"}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Quantity:</strong> {item?.cartItems[0]?.quantity}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Price:</strong> Rs.{item.totalPrice.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <strong>Payment Date:</strong>{" "}
                      {item.paymentDate?.toDate().toLocaleDateString() || "Pending"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </>
        ) : (
          <Typography sx={{ textAlign: "center", mt: 4 }}>No purchase history found.</Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default History;
