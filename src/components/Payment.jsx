import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../JS Files/Firebase";  // Ensure your db import is correct
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

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

    const booksRef = collection(db, "Carts");  // Make sure this matches your Firestore collection name
    const booksQuery = query(
      booksRef,
      where("createdFor", "==", current_uid),
      orderBy("createdAt", "asc")  // Ensure `createdAt` is indexed
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Receipt
      </Typography>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item Name</strong></TableCell>
                <TableCell align="center"><strong>Quantity</strong></TableCell>
                <TableCell align="center"><strong>Price</strong></TableCell>
                <TableCell align="center"><strong>Subtotal</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {AllCartItems.length > 0 ? (
                AllCartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">Rs.{item.productPrice}</TableCell>
                    <TableCell align="center">
                      Rs.{(item.productPrice * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Add Items to Your Cart
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ marginTop: 2, textAlign: "right", color:"white" }}>
        <Typography variant="h6">
          <strong>Total: Rs.{totalPrice.toFixed(0)}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default Payment;
