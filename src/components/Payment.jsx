import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const MotionTableRow = motion(TableRow); // Create a motion-enhanced TableRow

const Payment = () => {
  const { signin } = useContext(AuthContext);
  const current_uid = signin?.userLoggedIn?.uid;
  const [AllCartItems, setAllCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!current_uid) {
      console.error("No user is logged in.");
      return;
    }

    const booksRef = collection(db, "Carts");
    const booksQuery = query(
      booksRef,
      where("createdFor", "==", current_uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      booksQuery,
      (querySnapshot) => {
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllCartItems(books);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [current_uid]);

  const totalPrice = AllCartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          padding: 3,
          color: "white",
          backgroundColor: "#1A202C",
          borderRadius: "10px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#FFD700",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Payment Receipt
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
            <CircularProgress sx={{ color: "#FFD700" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#2D3748",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#FFD700", fontWeight: "bold" }}>
                    Item Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#FFD700", fontWeight: "bold" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#FFD700", fontWeight: "bold" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "#FFD700", fontWeight: "bold" }}
                  >
                    Subtotal
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {AllCartItems.length > 0 ? (
                  AllCartItems.map((item, index) => (
                    <MotionTableRow
                      key={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <TableCell sx={{ color: "#fff" }}>
                        {item.productName}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#fff" }}>
                        {item.quantity}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#fff" }}>
                        Rs.{item.productPrice}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "#fff" }}>
                        Rs.{item.productPrice * item.quantity}
                      </TableCell>
                    </MotionTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ color: "#fff" }}
                    >
                      Add Items to Your Cart
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && (
          <Box
            sx={{
              marginTop: 2,
              textAlign: "right",
              padding: "16px",
              borderRadius: "10px",
              backgroundColor: "#2D3748",
              color: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              display:"flex",
              justifyContent:"space-between"
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#FFD700",
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#FFD700",
              }}
            >
            Rs.{totalPrice.toFixed(0)}
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default Payment;
