import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        userData
      );
      console.log("Registration Successful", response.data);
      // Handle successful registration, perhaps redirect or clear form
      nav("/login");
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.error("Registration Error:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Registration Request Error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from submitting normally
    const credentials = {
      username: username,
      password: password,
    };
    registerUser(credentials);
  };

  return (
    <div className="auth-page">
      <h1 id="register-title">Register</h1>
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
          autoComplete="username"
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
          autoComplete="current-password"
          required
        />
        <button
          id="register-submit-button"
          className="submit-button"
          type="submit"
        >
          Register
        </button>
        <div className="user-auth-button-group">
          <Link id="guest-link" className="link" to="/">
            Continue as Guest
          </Link>
          <Link className="link" to="/login">
            Already a user? Login here!
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
