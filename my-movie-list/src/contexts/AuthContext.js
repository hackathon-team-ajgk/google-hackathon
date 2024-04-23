import React, { createContext, useContext, useState } from "react";

// Create the context with a default undefined value
const AuthContext = createContext(undefined);

// AuthProvider component that will wrap your app or part of it
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [userName, setUserName] = useState("");

  // Define the functions to handle login, logout, and guest user
  const handleLogin = () => {
    if (isGuest) {
      setIsGuest(false);
    }
    setIsLoggedIn(true);
  };
  const handleLogout = () => setIsLoggedIn(false);
  const handleGuestUser = () => setIsGuest(true);
  const handleUsername = (username) => {
    setUserName(username);
  };

  return (
    <AuthContext.Provider
      value={{
        userName,
        isGuest,
        isLoggedIn,
        handleLogin,
        handleLogout,
        handleGuestUser,
        handleUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
