import React from 'react'
import AdminOrders from '../MainDashboard/Screens/Orders/AdminOrders';
const StaffDashboard = () => {
  const businessCode = localStorage.getItem("businessCode");

const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.clear();
    window.location.href = "/";
  }
};

  return (
    <div style={{ display: "flex", justifyContent: "space-between", margin: "20px", position: "relative" }}>
      <div style={{ width: "100%", }}>
        <AdminOrders businessCode={businessCode} />
      </div>
      <div className="sidebar-footer" style={{
        position: "absolute",
        top: "20px",
        right: "10px",
        padding: "10px",
       zIndex:"10"}}>
      <button style={{ padding: 10, borderRadius: "20px", border: "none", 
        background: "#974d2b", cursor: "pointer", color: "white" }} onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
   
        </div >
  )
}

export default StaffDashboard;