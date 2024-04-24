import { useNavigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";

function Layout() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const routeToLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("username");
    try {
      const response = await axios.post("http://localhost:3000/logout");
      console.log("Logout Successful", response.data);
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Logout Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Registration Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
    navigate("/login");
  };

  const isSessionExpired = () => {
    const tokenString = sessionStorage.getItem("userToken");
    const token = tokenString ? JSON.parse(tokenString) : null;
    if (!token) {
      return true;
    }
    const now = new Date();
    return now.getTime() > token.expiry;
  };

  useEffect(() => {
    if (isSessionExpired()) {
      // Logout the user or redirect to login page
      sessionStorage.removeItem("userToken"); // Clear the expired token
      sessionStorage.removeItem("username"); // Clear the current users username
      // Redirect to login or do other logout cleanup here
      console.log("Session expired. Redirecting to login.");
    }
  }, []);

  return (
    <div className="app">
      <div className="header-container">
        <h1
          id="title"
          onClick={() => {
            navigate("/");
          }}
        >
          MyMovieList
        </h1>
        {!sessionStorage.getItem("userToken") ? (
          <button
            id="login-button"
            className="auth-button"
            onClick={routeToLogin}
          >
            Login
          </button>
        ) : (
          <div id="user-account-buttons" className="button-group">
            <div id="user-account">
              <p id="username">{username}</p>
              <ArrowDropDownIcon />
            </div>
            <button
              id="logout-button"
              className="auth-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
