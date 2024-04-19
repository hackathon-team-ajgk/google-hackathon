import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    nav("/");
  };

  return (
    <>
      <h1 className="title">Login</h1>
      <div className="container">
        <form className="user-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username-field">Username:</label>
          <input
            id="username-field"
            className="auth-field"
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
          <label htmlFor="password-field">Password:</label>
          <input
            id="password-field"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default Login;
