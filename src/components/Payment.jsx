import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
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
import { ThemeContext } from "../context/ThemeContext";
import toast from "react-hot-toast";

const Payment = () => {
  const { signin } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const current_uid = signin?.userLoggedIn?.uid;

  const [AllCartItems, setAllCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [enteredAmount, setEnteredAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!current_uid) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "Carts"),
        where("createdFor", "==", current_uid),
        orderBy("createdAt", "asc")
      ),
      (snapshot) => {
        setAllCartItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    if (isProcessing || totalPrice === 0) return;
    setIsProcessing(true);

    if (parseFloat(enteredAmount) === totalPrice) {
      try {
        const paymentDetails = {
          userId: current_uid,
          cartItems: AllCartItems,
          totalPrice,
          paymentDate: serverTimestamp(),
        };

        const historyRef = doc(collection(db, "History"));
        await setDoc(historyRef, paymentDetails);

        const deletePromises = AllCartItems.map((item) =>
          deleteDoc(doc(db, "Carts", item.id))
        );
        await Promise.all(deletePromises);

        toast.success("Payment successful and cart cleared!");
        setModalOpen(false);
        setEnteredAmount("");
        setAllCartItems([]);
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("Error processing payment.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast.error("Entered amount does not match the total bill.");
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        sx={{
          p: 3,
          color: theme === "light" ? "#fff" : "#000",
          bgcolor: theme === "light" ? "#333" : "#fff",
          borderRadius: "10px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          Payment Receipt
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "10px",
              color: theme === "light" ? "#000" : "#fff",
              bgcolor: theme === "light" ? "#333" : "#fff",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {["Item Name", "Quantity", "Price", "Subtotal"].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{ fontWeight: "bold", color: theme === "light" ? "#fff" : "#000" }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {AllCartItems.length ? (
                  AllCartItems.map(({ productName, quantity, productPrice }, index) => (
                    <TableRow key={index}>
                      {[
                        productName,
                        quantity,
                        `Rs.${productPrice}`,
                        `Rs.${productPrice * quantity}`,
                      ].map((value, idx) => (
                        <TableCell key={idx} sx={{ color: theme === "light" ? "#fff" : "#000" }}>
                          {value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No items in your cart
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!loading && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Total: Rs.{totalPrice.toFixed(0)}</Typography>
            <Button
              variant="contained"
              onClick={() => setModalOpen(true)}
              disabled={totalPrice === 0 || isProcessing}
              sx={{
                bgcolor: "#FFD700",
                "&:hover": { bgcolor: "#FFC107" },
                color: "#333",
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
            width: "90%",
            maxWidth: 400,
            p: 4,
            bgcolor: theme === "dark" ? "#fff" : "#333",
            color: theme === "dark" ? "#333" : "#fff",
            borderRadius: "10px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            Enter Amount to Pay
          </Typography>
          <TextField
            value={enteredAmount}
            onChange={(e) => setEnteredAmount(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              mb: 3,
              input: {
                color: theme === "dark" ? "#333" : "#fff",
                bgcolor: theme === "dark" ? "#f9f9f9" : "#555",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handlePayNow}
            fullWidth
            disabled={isProcessing}
            sx={{
              bgcolor: "#FFD700",
              "&:hover": { bgcolor: "#FFC107" },
              color: "#333",
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
