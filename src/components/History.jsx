import { useEffect, useState, useContext } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { AuthContext } from "../context/AuthContext";
import {
  Box, Typography, CircularProgress, Card, CardContent, CardMedia
} from "@mui/material";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { signin } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const current_uid = signin?.userLoggedIn?.uid;

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
        toast.error("No Data Found Please Try Again");
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : historyItems.length ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {historyItems.map((item) => (
              <Card
                key={item.id}
                sx={{
                  backgroundColor: theme === "light" ? "#f5f5f5" : "#1a1a1a",
                  color: theme === "light" ? "#333" : "#fff",
                  maxWidth: 300,
                }}
              >
                {item.photoURL && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.photoURL}
                    alt={item.productName || "Product Image"}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.productName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {item.quantity}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> Rs.{item.productPrice}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Subtotal:</strong> Rs.{item.subtotal}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Payment Date:</strong>{" "}
                    {item.paymentDate?.toDate().toLocaleString() || "Pending"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            No purchase history found.
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default History;