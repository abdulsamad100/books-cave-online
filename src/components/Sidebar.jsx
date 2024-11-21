import React from "react";
import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";

const Sidebar = ({ onContactClick }) => {
  return (
    <Box
      sx={{
        height: "85vh",
        backgroundColor: "#f0f0f0",
        padding: 2,
        borderRight: "1px solid #ddd",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Contacts
      </Typography>
      <List>
        {["Group Chat"].map((contact, index) => (
          <ListItemButton
            key={index}
            sx={{ cursor: "pointer" }}
            onClick={() => onContactClick(contact)}
          >
            <ListItemText primary={contact} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
