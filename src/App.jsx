import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/MainDashboard/Dashboard.jsx";
import StaffDashboard from "./pages/Dashboard/Staff/StaffDashboard.jsx";
import QrMenu from "./pages/Dashboard/Customer/QrMenu.jsx";

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
      <Route
        path="/b/:businessCode/u/:unitCode"
        element={<QrMenu />}
      />

      {/* ✅ LOGIN / REDIRECT */}
<Route
  path="/"
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
    </Routes>
  );
}

export default App;
