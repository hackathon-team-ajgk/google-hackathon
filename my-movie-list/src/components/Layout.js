import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import axios from "axios";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import axios from "axios";

function Layout() {
  const navigate = useNavigate();
  const { getToken, getUsername, handleLogout } = useAuth();

  // State to manage visibility of dropdown menu for user profile
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:3000/user", {
          headers: {
            authorization: token,
          },
          params: {
            username: username,
          },
        });
        const userData = JSON.stringify(response.data[0]);
        localStorage.setItem("userData", userData);
      } catch (error) {
        if (error.response) {
          // The server responded with a status code that falls out of the range of 2xx
          console.error("Get Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request Error:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error.message);
        }
      }
    };
    getUserInfo();
  }, [username, getToken]);

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

  // Side effect so that everytime the app is refreshed or mounted
  // if token still exists (user has not logged out) then the user will
  // stay signed in.

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

          {getToken() ? (
            <div className="dropdown">
              <button
                id="profile-btn"
                className="button"
                onClick={toggleDropdown}
              >
                {username}
              </button>
              {isDropdownOpen && (
                <Dropdown toggle={toggleDropdown} logout={logoutUser} />
              )}
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
