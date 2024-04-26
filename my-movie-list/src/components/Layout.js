import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import axios from "axios";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import { useAuth } from "../contexts/AuthContext";
// import { useEffect } from "react";

function Layout() {
  const navigate = useNavigate();

  // User's JWT token and helper Logout function from custom Context
  const { userToken, handleLogout } = useAuth();

  // Function to get the user's username from the localStorage Obj
  const getUsername = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const userObject = JSON.parse(userString);
      const username = userObject.name;
      return username;
    }

    return null;
  };

  const username = getUsername();

  // Helper function to route to Login page
  const routeToLogin = () => {
    navigate("/login");
  };

  // Function for logging out the user
  const logoutUser = () => {
    handleLogout();
    routeToLogin();
  };

  // Function for getting all users in DB only for testing.
  // const getUsers = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/allUsers");
  //     console.log(response.data);
  //   } catch (error) {
  //     if (error.response) {
  //       // The server responded with a status code that falls out of the range of 2xx
  //       console.error("Get Retrieval Error:", error.response.data);
  //       console.error("Status Code:", error.response.status);
  //     } else if (error.request) {
  //       // The request was made but no response was received
  //       console.error("Get Request Error:", error.request);
  //     } else {
  //       // Something happened in setting up the request that triggered an Error
  //       console.error("Error:", error.message);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getUsers();
  // });

  return (
    <div className="app">
      <div className="header-container">
        <div className="sub-header-container">
          <h1
            id="title"
            onClick={() => {
              navigate("/");
            }}
          >
            MyMovieList
          </h1>
          {userToken ? (
            <div id="user-details-and-logout" className="button-group">
              <button id="profile-btn" className="button">
                {username}
              </button>
              <button
                id="logout-button"
                className="button"
                onClick={logoutUser}
              >
                Logout
              </button>
            </div>
          ) : (
            <button id="login-button" className="button" onClick={routeToLogin}>
              Login
            </button>
          )}
        </div>
        <Navbar />
      </div>
      <main className="page">
        <Outlet />
      </main>
      <footer>
        <div id="footer-socials" className="footer-container">
          <span className="social-icon">
            <InstagramIcon fontSize="large" />
          </span>
          <span className="social-icon">
            <FacebookIcon fontSize="large" />
          </span>
          <span className="social-icon">
            <XIcon fontSize="large" />
          </span>
          <span className="social-icon">
            <GitHubIcon fontSize="large" />
          </span>
        </div>
        <div id="footer-navbar" className="footer-container">
          <Navbar />
        </div>
        <div id="footer-copyright" className="footer-container">
          <p id="footer-title">MyMovieList &copy; 2024</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
