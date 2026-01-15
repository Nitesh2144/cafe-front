import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/MainDashboard/Dashboard.jsx";
import StaffDashboard from "./pages/Dashboard/Staff/StaffDashboard.jsx";
import QrMenu from "./pages/Dashboard/Customer/QrMenu.jsx";
function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAdmin = token && role === "admin";
  const isStaff = token && role === "staff";

  return (
    <Routes>
        <Route
        path="/b/:businessCode/u/:unitCode"
        element={<QrMenu />}
      />

      <Route
        path="/"
        element={
          !token ? (
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
        path="/admin/dashboard/*"
        element={isAdmin ? <Dashboard /> : <Navigate to="/" replace />}
      />

      <Route
        path="/staff/dashboard/*"
        element={isStaff ? <StaffDashboard /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
