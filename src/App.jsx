import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/MainDashboard/Dashboard.jsx";
import StaffDashboard from "./pages/Dashboard/Staff/StaffDashboard.jsx";
import QrMenu from "./pages/Dashboard/Customer/QrMenu.jsx";
import Home from "./pages/Home/Home.jsx";
import PrivacyPolicy from "./pages/Home/PrivacyPolicy";
import TermsConditions from "./pages/Home/TermsConditions";
import RefundPolicy from "./pages/Home/RefundPolicy";
import Contact from "./pages/Home/Contact";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAdmin = token && role === "admin";
  const isStaff = token && role === "staff";

  const navigate = useNavigate();
  
const isQrFlow = (() => {
  const params = new URLSearchParams(window.location.search);
  return params.get("b") && params.get("u");
})();

  // 🔥 QR QUERY PARAM REDIRECT (THIS FIXES PHONE + REFRESH ISSUE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const businessCode = params.get("b");
    const unitCode = params.get("u");

    if (businessCode && unitCode) {
      navigate(`/b/${businessCode}/u/${unitCode}`, { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      
      {/* ✅ CUSTOMER QR MENU */}
    
   <Route path="/" element={<Home />} />

      {/* ✅ LOGIN / REDIRECT */}
<Route
  path="/login"
  element={
    isQrFlow ? (
      <div style={{ padding: 20, textAlign: "center" }}>
        🍽 Loading menu...
      </div>
    ) : !token ? (
      <Login />
    ) : isAdmin ? (
      <Navigate to="/admin/dashboard" replace />
    ) : isStaff ? (
      <Navigate to="/staff/dashboard" replace />
    ) : (
      <Login />
    )
  }
/>
  <Route
        path="/b/:businessCode/u/:unitCode"
        element={<QrMenu />}
      />


      {/* ✅ ADMIN */}
      <Route
        path="/admin/dashboard/*"
        element={isAdmin ? <Dashboard /> : <Navigate to="/" replace />}
      />

      {/* ✅ STAFF */}
      <Route
        path="/staff/dashboard/*"
        element={isStaff ? <StaffDashboard /> : <Navigate to="/" replace />}
      />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms-and-conditions" element={<TermsConditions />} />
<Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
