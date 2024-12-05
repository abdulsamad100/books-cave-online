import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
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
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [current_uid]);

  const totalPrice = AllCartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 1),
    0
  );
  const handlePayNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    if (parseFloat(enteredAmount) === totalPrice) {
      try {
        const paymentDetails = {
          userId: current_uid,
          cartItems: AllCartItems,
          totalPrice,
          paymentDate: serverTimestamp(),
          buyer: current_uid,
        };

        const historyRef = doc(collection(db, "History"));
        await setDoc(historyRef, paymentDetails);

        const deletePromises = AllCartItems.map((item) =>
          deleteDoc(doc(db, "Carts", item.id))
        );
        await Promise.all(deletePromises);

        toast.success("Payment Successful and Cart Items Removed!");
        setModalOpen(false);
        setEnteredAmount("");
        setAllCartItems([]);
      } catch (error) {
        console.error("Error saving payment to history:", error);
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", color: theme === "light" ? "#FFD700" : "#000", fontWeight: "bold" }}
        >
          Payment Receipt
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress sx={{ color: theme === "light" ? "#FFD700" : "#000" }} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ bgcolor: theme === "light" ? "#2D3748" : "#f5f5f5", borderRadius: "10px" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {["Item Name", "Quantity", "Price", "Subtotal"].map((heading) => (
                    <TableCell key={heading} sx={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}>
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {AllCartItems.length ? (
                  AllCartItems.map(({ productName, quantity, productPrice }, index) => (
                    <motion.tr key={index}>
                      {[productName, quantity, `Rs.${productPrice}`, `Rs.${productPrice * quantity}`].map((value, idx) => (
                        <TableCell key={idx} sx={{ color: theme === "light" ? "#fff" : "#000" }}>
                          {value}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: theme === "light" ? "#fff" : "#000" }}>
                      Add Items to Your Cart
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!loading && (
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", p: 2, bgcolor: theme === "light" ? "#2D3748" : "#fff", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
            <Typography variant="h6" sx={{ color: theme === "light" ? "#fff" : "#000", fontWeight: "bold" }}>
              Total: Rs.{totalPrice.toFixed(0)}
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "#FFD700", color: "#000", "&:hover": { bgcolor: "#FFC300" } }}
              onClick={() => setModalOpen(true)}
            >
              Pay Now
            </Button>
          </Box>
        )}
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", p: 3, bgcolor: theme === "light" ? "#333" : "#fff", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0,0,0,0.2)", textAlign: "center", color: theme === "light" ? "#fff" : "#000" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Enter Amount to Pay</Typography>
          <TextField
            value={enteredAmount}
            onChange={(e) => setEnteredAmount(e.target.value)}
            label="Amount"
            fullWidth
            sx={{ mt: 2, mb: 3, input: { color: theme === "light" ? "#fff" : "#000" } }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#FFD700", color: theme === "light" ? "#1A202C" : "#fff", "&:hover": { bgcolor: "#FFC300" } }}
            onClick={handlePayNow}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default Payment;
