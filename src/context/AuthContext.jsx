import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../JS Files/Firebase";
import { CircularProgress } from "@mui/material";

export const AuthContext = createContext({
  userLoggedIn: null,
  isLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [signin, setSignin] = useState({ userLoggedIn: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // For handling any errors during auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          setSignin({ userLoggedIn: user });
        } else {
          setSignin({ userLoggedIn: null });
        }
        setIsLoading(false);
      },
      (err) => {
        // Handle errors if any (like network issues, etc.)
        setError("Failed to authenticate, please try again.");
        setIsLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ signin, isLoading, error }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#000",
            margin: "-8px",
          }}
        >
          <CircularProgress sx={{ color: "#fff" }} />
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "white",
            backgroundColor: "#000",
          }}
        >
          <p>{error}</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
