import { useEffect, useState, useContext } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
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
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [current_uid]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          p: 4,
          bgcolor: theme === "dark" ? "#f5f5f5" : "#1A202C",
          color: theme === "dark" ? "#333" : "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "2rem",
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
            <CircularProgress
              sx={{ color: theme === "dark" ? "#333" : "#FFD700" }}
            />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2, display:"flex", flexDirection:"column",alignItems:"center" }}>
            {historyItems.length ? (
              historyItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card
                    sx={{
                      bgcolor: theme === "dark" ? "#fff" : "#2D3748",
                      color: theme === "dark" ? "#333" : "#fff",
                      borderRadius: "12px",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={item.productImage || "https://via.placeholder.com/200"}
                      alt={item.productName}
                      sx={{
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          fontSize: "1.2rem",
                          textAlign: "center",
                        }}
                      >
                        {item.productName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          marginBottom: "0.5rem",
                          color: theme === "dark" ? "#555" : "#bbb",
                        }}
                      >
                        <strong>Author:</strong> {item.authorName || "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.9rem",
                          marginBottom: "0.5rem",
                          color: theme === "dark" ? "#555" : "#bbb",
                        }}
                      >
                        <strong>Date:</strong>{" "}
                        {item.paymentDate?.toDate().toLocaleDateString() || "N/A"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          fontSize: "1rem",
                          color: theme === "dark" ? "#000" : "#FFD700",
                          textAlign: "center",
                        }}
                      >
                        Rs.{item.totalPrice.toFixed(0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="h6"
                sx={{
                  mt: 4,
                  fontSize: "1.2rem",
                  color: theme === "dark" ? "#555" : "#ccc",
                }}
              >
                No Purchase History Found
              </Typography>
            )}
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default History;
