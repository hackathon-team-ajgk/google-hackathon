import { useNavigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="app">
      <div className="header-container">
        <h1 id="title">MyMovieList</h1>
        <button id="login-button" className="button" onClick={handleLogin}>
          Login
        </button>
      </div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
