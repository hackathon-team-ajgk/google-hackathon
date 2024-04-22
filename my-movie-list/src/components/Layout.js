import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <div>
        <h1>myMovieList</h1>
        <Navbar />
        <button>Login</button>
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
