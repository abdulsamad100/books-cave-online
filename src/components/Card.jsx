import React from "react";
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box
} from "@mui/material";

const Card = ({ image, title, stock, details, price, author, category, createdAt, createdBy, photoURL, onAddToCart, cardid }) => {
  const formattedDate = createdAt && createdAt.seconds
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : createdAt;
  const displayImage = photoURL || image || "https://via.placeholder.com/150"; // Default fallback image

  const handleCardClick = () => {
    console.log(cardid ," >>> added successfully");
    alert(cardid +" >>> added successfully");
  } 

  return (
    <MuiCard
      sx={{
        zIndex: 1,
        maxWidth: 250,
        margin: "16px auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={displayImage}  // Use fallback image if no photoURL
        alt={title}
      />
      <CardContent >
        <Typography variant="h5" sx={{ fontWeight: "bold" }} component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {details}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stock} items Available
        </Typography>

        {/* New fields */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.primary">
            Author: <b>{author}</b>
          </Typography>
          <Typography variant="body2" color="text.primary">
            Category: <b>{category}</b>
          </Typography>
          <Typography variant="body2" color="text.primary">
            Uploded At: <b>{formattedDate}</b>
          </Typography>
          <Typography variant="body2" color="text.primary">
            Created By: {createdBy}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", padding: "16px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: "10px" }}>
          Rs. {price.toFixed(0)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onAddToCart}
          sx={{ color: "#000", backgroundColor: "#FFD700" }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </MuiCard>
  );
};

export default Card;
