import React, { createContext, useContext, useState } from "react";

// Create the context with a default undefined value
const AuthContext = createContext(undefined);

// AuthProvider component that will wrap your app or part of it
export const AuthProvider = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("userToken");
  const [isGuest, setIsGuest] = useState(true);

  // Define the functions to handle login, logout, and guest user
  const handleLogin = () => {
    if (isGuest) {
      setIsGuest(false);
    }
  };
  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
  };
  const handleGuestUser = () => setIsGuest(true);

  return (
    <AuthContext.Provider
      value={{
        isGuest,
        isLoggedIn,
        handleLogin,
        handleLogout,
        handleGuestUser,
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
