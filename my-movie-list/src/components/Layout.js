import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";

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

  // const isSessionExpired = () => {
  //   const tokenString = sessionStorage.getItem("userToken");
  //   const token = tokenString ? JSON.parse(tokenString) : null;
  //   if (!token) {
  //     return true;
  //   }
  //   const now = new Date();
  //   return now.getTime() > token.expiry;
  // };

  // useEffect(() => {
  //   if (isSessionExpired()) {
  //     // If user's session is expired, send refresh token to generate new token
  //     // refreshUserSession();
  //     // Logout the user or redirect to login page
  //     sessionStorage.removeItem("userToken"); // Clear the expired token
  //     sessionStorage.removeItem("username"); // Clear the current users username
  //     // Redirect to login or do other logout cleanup here
  //     console.log("Session expired. Redirecting to login.");
  //   }
  // }, []);

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

        <button
          id="login-button"
          className="auth-button"
          onClick={routeToLogin}
        >
          Login
        </button>
      </div>
      <Navbar />
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
