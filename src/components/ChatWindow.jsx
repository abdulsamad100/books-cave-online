import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Menu, MenuItem,
} from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../JS Files/Firebase";
import toast, { Toaster } from 'react-hot-toast';

const ChatWindow = ({ selectedContact }) => {
  const { signin: { userLoggedIn } } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuMessageId, setMenuMessageId] = useState(null);
  const usersRef = useRef({});

  const handleMenuOpen = (event, messageId) => {
    setAnchorEl(event.currentTarget);
    setMenuMessageId(messageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMessageId(null);
  };

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = {};
      snapshot.forEach((doc) => {
        usersData[doc.id] = doc.data().username;
      });
      usersRef.current = usersData;
    });

    return () => unsubscribeUsers();
  }, []);

  useEffect(() => {
    if (!selectedContact) return;
    setLoading(true);

    const messageQuery = query(
      collection(db, "messages"),
      orderBy("sentAt", "asc")
    );

    const unsubscribeMessages = onSnapshot(messageQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const messageData = doc.data();
        return {
          id: doc.id,
          ...messageData,
          userName: usersRef.current[messageData.sentBy] || "Unknown",
        };
      });
      setMessages(newMessages);
      setLoading(false);
    });

    return () => {
      unsubscribeMessages();
    };
  }, [selectedContact]);

  const handleSend = async () => {
    if (input.trim()) {
      if (!userLoggedIn || !userLoggedIn.uid) {
        toast.error("User is not logged in or UID is missing.");
        return;
      }
      try {
        await addDoc(collection(db, "messages"), {
          text: input,
          sentBy: userLoggedIn.uid,
          sentAt: serverTimestamp(),
        });
        setInput("");
      } catch (error) {
        toast.error("Error sending message: ", error);
      }
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    } catch (error) {
      toast.error("Error deleting message: ", error);
    }
  };

  const handleEdit = (message) => {
    setEditMode(message.id);
    setEditText(message.text);
  };

  const handleSaveEdit = async (messageId) => {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        text: editText,
        messageEdited: true,
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, text: editText } : msg
        )
      );
      setEditMode(null);
      setEditText("");
    } catch (error) {
      toast.error("Error updating message: ", error);
    }
  };

  if (!selectedContact) {
    return (
      <Box sx={{ height: "85vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6">Select a contact to start chatting</Typography>
      </Box>
    );
  }

  return (
    <>
      <Toaster />
      <Box sx={{ display: "flex", flexDirection: "column", height: "85vh" }}>

        <Box sx={{ flexGrow: 1, padding: 2, overflowY: "auto", borderBottom: "1px solid #ddd" }}>
          <Typography variant="h6" gutterBottom>
            Chat with {selectedContact}
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    display: "flex",
                    justifyContent: message.sentBy === userLoggedIn.uid ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      padding: 1.5,
                      borderRadius: 2,
                      backgroundColor: message.sentBy === userLoggedIn.uid ? "#b3e5fc" : "#1976d2",
                      color: message.sentBy === userLoggedIn.uid ? "#000" : "#fff",
                      position: "relative",
                    }}
                  >
                    {message.sentBy === userLoggedIn.uid && (
                      <Box
                        sx={{ position: "absolute", top: -3, right: -30 }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, message.id)}
                        >
                          <ArrowDropDown />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={menuMessageId === message.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem onClick={() => { handleEdit(message); handleMenuClose(); }}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => { handleDelete(message.id); handleMenuClose(); }}>
                            Delete
                          </MenuItem>
                        </Menu>
                      </Box>

                    )}
                    <Typography variant="body2" fontWeight="bold" >
                      {message.sentBy === userLoggedIn.uid ? "You" : usersRef.current[message.sentBy] || "Unknown"}
                      {message.messageEdited && (
                        <Typography variant="body2" sx={{ fontStyle: "italic", color: "gray" }}>
                          (edited)
                        </Typography>
                      )}
                    </Typography>


                    {editMode === message.id ? (
                      <TextField
                        fullWidth
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => handleSaveEdit(message.id)}
                        variant="standard"
                      />
                    ) : (
                      <>

                        <Typography variant="body1">{message.text}</Typography>
                      </>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ display: "flex", padding: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Type a message"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} variant="contained" color="primary" sx={{ marginLeft: 1 }}>
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ChatWindow;
