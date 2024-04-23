import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const { isLoggedIn, userName, handleLogout } = useAuth();

  const routeToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="app">
      <div className="header-container">
        <h1 id="title">MyMovieList</h1>
        {!isLoggedIn ? (
          <button id="login-button" className="button" onClick={routeToLogin}>
            Login
          </button>
        ) : (
          <div id="user-account-buttons" className="button-group">
            <p id="username">{userName}</p>
            <button
              id="logout-button"
              className="button"
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
