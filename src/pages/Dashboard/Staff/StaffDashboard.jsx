import React from 'react'
import AdminOrders from '../MainDashboard/Screens/Orders/AdminOrders';
import { useNavigate } from "react-router-dom";


const StaffDashboard = () => {
  const businessCode = localStorage.getItem("businessCode");
const navigate = useNavigate();

const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.clear();
  navigate("/", { replace: true });

  }
};

  return (
    <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        <div className="sidebar-footer" style={{
        position: "absolute",
        top: "20px",
        right: "10px",
        padding: "5px",
       zIndex:"10"}}>
      <button style={{ padding: 5, borderRadius: "20px", border: "none", 
        background: "#974d2b", cursor: "pointer", color: "white", width:"40px", height:"40px" , fontSize:"18px"}} onClick={handleLogout}>
         ⏻
      </button>
    </div>
      <div style={{ width: "100%", }}>
        <AdminOrders businessCode={businessCode} />
      </div>
    
   
        </div >
  )
}

export default StaffDashboard;