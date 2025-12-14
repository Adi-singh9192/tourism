// src/pages/Auth/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";

const ADMIN_SESSION_TIME = 10 * 60 * 1000; // 10 minutes

const AdminLogin = ({ onAdminLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Mock admin auth (replace with real backend later)
    if (credentials.username && credentials.password) {
      const expiresAt = Date.now() + ADMIN_SESSION_TIME;

      // ✅ Save to localStorage
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          isAdmin: true,
          expiresAt,
        })
      );

      onAdminLogin(); // update app state
      navigate("/admin");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-700">
      <div className="w-full max-w-md">
        <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">

          {/* Icon */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <FaUserShield className="text-white text-4xl" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mt-14 mb-10">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Admin Portal
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Rajasthan Tourism Department
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Admin ID */}
            <div className="relative">
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="peer w-full bg-white/90 px-4 pt-6 pb-2 rounded-xl focus:outline-none"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500">
                Admin ID
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="peer w-full bg-white/90 px-4 pt-6 pb-2 rounded-xl focus:outline-none"
              />
              <label className="absolute left-4 top-2 text-xs text-gray-500">
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl hover:scale-[1.02] transition"
            >
              Secure Login
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-black/80 font-bold">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
