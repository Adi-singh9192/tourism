import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// User Pages
import UserHome from "./pages/user/Home";
import FootfallAnalysis from "./pages/user/FootfallAnalysis";
import HotelSuggestions from "./pages/user/HotelSuggestions";
import HeatmapPage from "./pages/user/HeatmapPage";
import SelectType from "./pages/user/SelectType";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import FootfallAnalytics from "./pages/admin/FootfallAnalytics";
import VisitorSegmentation from "./pages/admin/VisitorSegmentation";
import HotelAnalytics from "./pages/admin/HotelAnalytics";
import AlertsManagement from "./pages/admin/AlertsManagement";

// Admin Login
import AdminLogin from "./pages/Auth/AdminLogin";
import TouristServicesPage from "./pages/user/TouristServicesPage";

/* ================= SESSION UTILS ================= */

const getAdminFromStorage = () => {
  try {
    const data = JSON.parse(localStorage.getItem("adminAuth"));
    if (!data) return false;

    // ⏱ Expired
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem("adminAuth");
      return false;
    }

    return data.isAdmin === true;
  } catch {
    return false;
  }
};

/* ================= APP LAYOUT ================= */

const AppLayout = () => {
  const location = useLocation();

  // ✅ Initialize from localStorage
  const [isAdmin, setIsAdmin] = useState(getAdminFromStorage());

  const handleAdminLogin = () => setIsAdmin(true);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAdmin(false);
  };

  // 🔄 Auto-check session every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const valid = getAdminFromStorage();
      if (!valid) {
        setIsAdmin(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Hide header/footer on login page
  const hideLayout = location.pathname === "/adminlogin";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && (
        <Header isAdmin={isAdmin} onLogout={handleLogout} />
      )}

      <main className="flex-grow container mx-auto">
        <Routes>
          {/* ================= ADMIN LOGIN ================= */}
          <Route
            path="/adminlogin"
            element={
              isAdmin ? <Navigate to="/admin" /> : <AdminLogin onAdminLogin={handleAdminLogin} />
            }
          />

          {/* ================= USER ROUTES ================= */}
          <Route path="/" element={<UserHome />} />
          <Route path="/tickets" element={<SelectType />} />
          <Route path="/footfall" element={<FootfallAnalysis />} />
          <Route path="/hotels" element={<HotelSuggestions />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/tourist-services" element={<TouristServicesPage />} />

          {/* ================= ADMIN ROUTES (PROTECTED) ================= */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/adminlogin" />}
          />
          <Route
            path="/admin/footfall"
            element={isAdmin ? <FootfallAnalytics /> : <Navigate to="/adminlogin" />}
          />
          <Route
            path="/admin/visitors"
            element={isAdmin ? <VisitorSegmentation /> : <Navigate to="/adminlogin" />}
          />
          <Route
            path="/admin/hotels"
            element={isAdmin ? <HotelAnalytics /> : <Navigate to="/adminlogin" />}
          />
          <Route
            path="/admin/alerts"
            element={isAdmin ? <AlertsManagement /> : <Navigate to="/adminlogin" />}
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

/* ================= ROOT ================= */

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
