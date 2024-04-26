import React, { createContext, useContext, useState } from "react";

// Create the context with a default undefined value
const AuthContext = createContext(undefined);

// AuthProvider component that will wrap your app or part of it
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  // Define the functions to handle login, logout, and guest user
  const handleLogin = (username, token) => {
    console.log(token);
    const user = {
      name: username,
      userToken: token,
    };
    localStorage.setItem("user", JSON.stringify(user));
    console.log(user);
    setUserToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        handleLogin,
        handleLogout,
        setUserToken,
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
