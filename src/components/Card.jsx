import React, { useContext, useState } from "react";
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeContext } from "../context/ThemeContext";
import { th } from "framer-motion/client";

const ModalContent = styled(motion.div)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: 5,
  margin: "auto",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  overflow: "hidden",
}));

const Card = ({
  image,
  title,
  stock,
  details,
  price,
  author,
  category,
  createdAt,
  photoURL,
  onAddToCart,
  cardid,
  createdBy,
}) => {
  const [IsCardOpen, setIsCardOpen] = useState(false);
  const formattedDate = createdAt && createdAt.seconds
    ? new Date(createdAt.seconds * 1000).toLocaleDateString() : createdAt;
  const displayImage = photoURL || image || "https://via.placeholder.com/150";

  const { theme } = useContext(ThemeContext);
  const txtColor = { color: theme === 'light' ? '#fff' : "#000", transition: "0.5s" }

  const buttonStyle = {
    color: "#000",
    backgroundColor: "#FFD700",
    fontWeight: "bold",
  }

  const colors = {
    primary: theme === "light" ? "#fff" : "#000",
    bg: theme === "light" ? "#333" : "#fff",
  }

  return (
    <>
      <AnimatePresence>
        {IsCardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Modal
              open={IsCardOpen}
              onClose={() => setIsCardOpen(false)}
              BackdropProps={{
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  // padding:"10px",
                },
              }}
              keepMounted
            >
              <ModalContent
                layoutId={`card-${cardid}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                sx={{
                  mt: "2%",
                  width: { xs: "90vw", sm: "80vw", md: "70vw", lg: "60vw" },
                  height: { xs: "90vh", sm: "80vh", md: "max-content", lg: "max-content" },
                  padding: "15px",
                  transform: "translate(-50%, -50%)",
                  overflowY: "visible",
                  bgcolor: colors.bg,
                }}
              >
                <IconButton
                  onClick={() => setIsCardOpen(false)}
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    color: "grey.700",
                    zIndex: 1,
                  }}
                >
                  <CloseIcon sx={{ transition:"0.5s",color: colors.primary, mixBlendMode: "difference" }} />
                </IconButton>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", md: "40%" },
                      maxHeight: "100%",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={displayImage}
                      alt={title}
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      maxWidth: { xs: "100%", md: "60%" },
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, transition:"0.5s",color: colors.primary }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color={colors.primary}>
                      {details}
                    </Typography>
                    <Typography variant="body2" color={colors.primary}>
                      <b>Author:</b> {author}
                    </Typography>
                    <Typography variant="body2" color={colors.primary}>
                      <b>Category:</b> {category}
                    </Typography>
                    <Typography variant="body2" color={colors.primary}>
                      <b>Stock:</b> {stock} items available
                    </Typography>
                    <Typography variant="body2" color={colors.primary}>
                      <b>Uploaded by: </b>{createdBy}
                    </Typography>
                    <Typography variant="body2" color={colors.primary}>
                      <b>Uploaded on: </b>{formattedDate}
                    </Typography>
                  </Box>
                </Box>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", transition:"0.5s",color: colors.primary }}>
                    Rs. {price.toFixed(0)}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={onAddToCart}
                    sx={{
                      ...buttonStyle
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </ModalContent>
            </Modal>

          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${cardid}`}
        style={{ display: "inline-block", margin: "16px" }}
        onClick={() => setIsCardOpen(true)}
      >
        <MuiCard
          sx={{
            width: 280,
            margin: "16px auto",
            pb: "15px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            bgcolor: colors.bg,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
              bgcolor: colors.bg,
            },
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={displayImage}
            alt={title}
            sx={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 90%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 90%, transparent 100%)",
              WebkitMaskComposite: "destination-in",
              maskComposite: "exclude",
            }}
          />
          <CardContent>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", transition:"0.5s",color: colors.primary }}
              component="div"
              gutterBottom
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color={colors.primary}
              sx={{
                height: "37px",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {details}
            </Typography>


            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color={colors.primary}>
                Author: <b>{author}</b>
              </Typography>
              <Typography variant="body2" color={colors.primary}>
                Category: <b>{category}</b>
              </Typography>
              <Typography
                variant="body2"
                color={colors.primary}
                sx={{ mt: "10px" }}
              >
                {stock} items Available
              </Typography>
            </Box>
          </CardContent>
          <CardActions
            sx={{
              justifyContent: "space-between",
              padding: "16px",
              mt: "-10px",
              mb: "-15px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mr: "10px",
                fontSize: "18px",
                transition:"0.5s",color: colors.primary
              }}
            >
              Rs. {price.toFixed(0)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onAddToCart}
              sx={{
                ...buttonStyle,
                fontSize: "13px",
              }}
            >
              Add to Cart
            </Button>
          </CardActions>
        </MuiCard>
      </motion.div>
    </>
  );
};

export default Card;
