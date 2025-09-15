// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          <Link className="navbar-brand" to="/">Auth Demo</Link>
          <div className="d-flex gap-2">
            <Link className="nav-link text-white" to="/register">Register</Link>
            <Link className="nav-link text-white" to="/login">Login</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}
