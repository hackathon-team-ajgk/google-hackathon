import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    nav("/");
  };

  return (
    <div className="auth-page">
      <h1 id="login-title">Login</h1>
      <form className="user-auth-form" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="username-field">
          Username:
        </label>
        <input
          id="username-field"
          className="form-input"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          required
        />
        <label className="form-label" htmlFor="password-field">
          Password:
        </label>
        <input
          id="password-field"
          className="form-input"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
        <button
          id="login-submit-button"
          className="submit-button"
          type="submit"
        >
          Login
        </button>
        <div className="user-auth-button-group">
          <Link id="guest-link" className="link" to="/">
            Continue as Guest
          </Link>
          <Link className="link" to="/register">
            Not a user? Register here!
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
