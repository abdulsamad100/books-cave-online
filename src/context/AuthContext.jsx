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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignin({ userLoggedIn: user });
      } else {
        setSignin({ userLoggedIn: null });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ signin, isLoading }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#000",
            margin:"-8px"
          }}
        >
          <CircularProgress sx={{color:"#fff"}} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
