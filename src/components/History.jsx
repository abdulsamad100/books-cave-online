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
            color: theme === "light" ? "#333" : "#fff",
          }}
        >
          Purchase History
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress />
          </Box>
        ) : historyItems.length ? (
          <Grid container spacing={4}>
            {historyItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    backgroundColor: theme === "light" ? "#f5f5f5" : "#1a1a1a",
                    color: theme === "light" ? "#333" : "#fff",
                    width:"max-content"
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
                      <strong>Quantity:</strong> {item.quantity}
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
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ textAlign: "center", mt: 4 }}>No purchase history found.</Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default History;
