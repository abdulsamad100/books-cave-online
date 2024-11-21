import React from "react";
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

const Card = ({ image, title, stock, details, price, onAddToCart }) => {
  return (
    <MuiCard
      sx={{
        zIndex:1,
        maxWidth: 345,
        margin: "16px auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {details}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {stock+" items Avaiable"}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: "space-between", padding: "16px" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: "10px" }}>
          Rs. {price.toFixed(0)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onAddToCart}
          sx={{color:"#000", backgroundColor: "#FFD700"}}
        >
          Add to Cart
        </Button>
      </CardActions>
    </MuiCard>
  );
};

export default Card;
