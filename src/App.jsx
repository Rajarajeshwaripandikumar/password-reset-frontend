import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

export default function App() {
  return (
    <Router>
      <header className="bg-districtBg text-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="rounded-lg p-2"
              style={{ background: "linear-gradient(135deg,#0071DC,#0654BA)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M6 6h12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">Auth Demo</span>
          </Link>

          <nav className="flex gap-3 items-center">
            <Link className="text-sm hover:underline" to="/register">Register</Link>
            <Link className="text-sm hover:underline" to="/login">Login</Link>
          </nav>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-pageGradientStart to-pageGradientEnd py-12">
        <div className="container mx-auto px-6">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}
