// src/components/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import AlertMessage from "./AlertMessage";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });

    if (!token) {
      setAlert({ type: "danger", message: "Invalid or missing token." });
      setLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setAlert({ type: "danger", message: "Password must be at least 6 characters." });
      setLoading(false);
      return;
    }

    try {
      // Use the function exported from frontend/src/api.js
      const res = await API.resetPassword(token, password);
      // res is parsed JSON, e.g. { message: "Password has been reset successfully" }
      setAlert({ type: "success", message: res.message || "Password has been reset" });
      setPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      // api.handleResponse throws Error with message
      const message =
        err?.message ||
        (err?.response && (err.response.data?.message || JSON.stringify(err.response.data))) ||
        "Error resetting password";
      setAlert({ type: "danger", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-center">
      <div className="auth-card">
        <h1 className="h1-hero">Reset Password</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter new password"
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <AlertMessage {...alert} />
      </div>
    </div>
  );
}
