import { createContext, useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

export const ThemeContext = createContext({
  theme: "light", 
  toggleTheme: () => {},
  isLoading: true,
  error: null,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load theme preferences.");
      setIsLoading(false);
      console.error(err);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    } catch (err) {
      setError("Failed to save theme preferences.");
      console.error(err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading, error }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: theme === "light" ? "#fff" : "#000",
            margin: "-8px",
          }}
        >
          <CircularProgress sx={{ color: theme === "light" ? "#000" : "#fff" }} />
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: theme === "light" ? "#000" : "#fff",
            backgroundColor: theme === "light" ? "#fff" : "#000",
          }}
        >
          <p>{error}</p>
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
};
