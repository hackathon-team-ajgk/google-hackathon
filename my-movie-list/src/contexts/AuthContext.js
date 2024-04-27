import React, { createContext, useContext } from "react";

// Create the context with a default undefined value
const AuthContext = createContext(undefined);

// AuthProvider component that will wrap your app or part of it
export const AuthProvider = ({ children }) => {
  // Define the functions to handle login, logout, and guest user
  const handleLogin = (username, token) => {
    const user = {
      name: username,
      userToken: token,
    };
    localStorage.setItem("user", JSON.stringify(user));
    console.log(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        handleLogout,
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
