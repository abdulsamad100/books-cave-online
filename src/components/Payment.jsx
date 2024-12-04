import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
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
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";

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

const MotionTableRow = motion.create(TableRow);

const Payment = () => {
  const { signin } = useContext(AuthContext);
  const current_uid = signin?.userLoggedIn?.uid;
  const [AllCartItems, setAllCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { theme } = useContext(ThemeContext);

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

  const handlePayNow = async () => {
    if (isProcessing) return; // Prevent duplicate execution
    setIsProcessing(true);

    if (parseFloat(enteredAmount) === totalPrice) {
      try {
        const paymentDetails = {
          userId: current_uid,
          cartItems: AllCartItems,
          totalPrice,
          paymentDate: serverTimestamp(),
        };

        const historyRef = doc(collection(db, "History")); // Unique ID for the history entry
        await setDoc(historyRef, paymentDetails);

        // Remove cart items after successful payment
        const deletePromises = AllCartItems.map((item) =>
          deleteDoc(doc(db, "Carts", item.id))
        );
        await Promise.all(deletePromises);

        toast.success("Payment Successful and Cart Items Removed!");
        setModalOpen(false);
        setEnteredAmount("");
        setAllCartItems([]); // Clear the cart items state
      } catch (error) {
        console.error("Error saving payment to history:", error);
        toast.error("Error processing payment.");
      } finally {
        setIsProcessing(false); // Reset processing flag
      }
    } else {
      toast.error("Entered amount does not match the total bill.");
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box
        sx={{
          padding: 3,
          color: theme === "light" ? "#fff" : "#000",
          backgroundColor: theme === "light" ? "#333" : "#fff",
          borderRadius: "10px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            color: theme === "light" ? "#FFD700" : "#000",
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
            <CircularProgress sx={{ color: theme === "light" ? "#FFD700" : "#000" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: theme === "light" ? "#2D3748" : "#f5f5f5",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}>
                    Item Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}
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
                      <TableCell sx={{ color: theme === "light" ? "#fff" : "#000" }}>
                        {item.productName}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: theme === "light" ? "#fff" : "#000" }}
                      >
                        {item.quantity}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: theme === "light" ? "#fff" : "#000" }}
                      >
                        Rs.{item.productPrice}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: theme === "light" ? "#fff" : "#000" }}
                      >
                        Rs.{item.productPrice * item.quantity}
                      </TableCell>
                    </MotionTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ color: theme === "light" ? "#fff" : "#000" }}
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
              backgroundColor: theme === "light" ? "#2D3748" : "#fff",
              color: theme === "light" ? "#fff" : "#000",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme === "light" ? "#fff" : "#000",
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: theme === "light" ? "#fff" : "#000",
              }}
            >
              Rs.{totalPrice.toFixed(0)}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setModalOpen(true)}
              sx={{
                backgroundColor: "#FFD700",
                color: theme === "light" ? "#1A202C" : "#fff",
                fontWeight: "bold",
                marginTop: 2,
                "&:hover": { backgroundColor: "#FFC300" },
              }}
            >
              Pay Now
            </Button>
          </Box>
        )}
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: theme === "light" ? "#333" : "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            width: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: theme === "light" ? "#fff" : "#000",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: theme === "light" ? "#fff" : "#000",
            }}
          >
            Enter Amount to Pay
          </Typography>
          <TextField
            value={enteredAmount}
            onChange={(e) => setEnteredAmount(e.target.value)}
            label="Amount"
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: "20px",
              input: {
                color: theme === "light" ? "#fff" : "#000",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handlePayNow}
            disabled={isProcessing}
            sx={{
              backgroundColor: "#FFD700",
              color: theme === "light" ? "#1A202C" : "#fff",
              "&:hover": { backgroundColor: "#FFC300" },
            }}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default Payment;
