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
      const res = await API.resetPassword(token, password);
      const successMessage = (res && (res.message || res.success)) || "Password has been reset";
      setAlert({ type: "success", message: successMessage });
      setPassword("");
      // Wait a bit so user sees the success alert, then redirect to login
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      // Prefer structured server message, then err.message
      let message = "Error resetting password";
      if (err?.rawBody) {
        if (typeof err.rawBody === "object") {
          message = err.rawBody.message || err.rawBody.error || JSON.stringify(err.rawBody);
        } else if (typeof err.rawBody === "string" && err.rawBody.trim()) {
          message = err.rawBody;
        }
      } else if (err?.message) {
        message = err.message;
      }
      if (err?.status) message = `${message} (status ${err.status})`;
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
