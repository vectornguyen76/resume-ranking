// Import required modules
"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

// Define the structure of the context
interface ContextTheme {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  toggleDarkMode: () => void;
}

// Create a context with default values
const GlobalContext = createContext<ContextTheme>({
  isDarkMode: false,
  setIsDarkMode: (): boolean => false, // Incorrect return type, should be (): void
  toggleDarkMode: (): void => {},
});

// ContextProvider component to manage state and effects
export const ContextProvider = ({ children }: any) => {
  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedValue =
      typeof window !== "undefined" ? localStorage.getItem("isDarkMode") : null;
    return storedValue ? JSON.parse(storedValue) : false;
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Effect to update local storage and apply dark mode class to the document
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add("dark"); // Apply dark mode class
      } else {
        document.documentElement.classList.remove("dark"); // Remove dark mode class
      }
    }
  }, [isDarkMode]);

  // Provide the context to the children components
  return (
    <GlobalContext.Provider
      value={{ isDarkMode, setIsDarkMode, toggleDarkMode }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);
