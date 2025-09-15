// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api"; // expects API.loginUser(...)
import AlertMessage from "./AlertMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      // Use the function exported from frontend/src/api.js
      const res = await API.loginUser(email, password);
      // res is parsed JSON, e.g. { message: "Login successful" }
      setAlert({ type: "success", message: res.message || "Logged in" });

      // Optional: navigate somewhere on successful login (dashboard/home)
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      // api.handleResponse throws Error with a message string
      const message =
        err?.message ||
        (err?.response && (err.response.data?.message || JSON.stringify(err.response.data))) ||
        "Login failed";
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-center">
      <div className="auth-card">
        <h1 className="h1-hero">Login</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <AlertMessage {...alert} />
        <div className="footer-note">
          Forgot your password? <Link to="/forgot-password">Reset it</Link>
        </div>
      </div>
    </div>
  );
}
