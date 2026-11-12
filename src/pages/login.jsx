import React, { useState } from "react";
import "../styles/login.css";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Check temporary credentials
    if (username === "jed" && password === "1234") {
      setError("");
      localStorage.setItem("isLoggedIn", "true"); // <-- Save login status to browser
      onLoginSuccess(); // Log in successfully
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <p>Please enter your details to continue</p>

        <form onSubmit={handleLoginSubmit}>
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="jed"
            required
          />

          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="1234"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}