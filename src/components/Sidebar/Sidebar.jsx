import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const sidebarMenu = [
  { label: "Home", path: "/admin/dashboard", icon: "🏠", end: true },
  { label: "Units", path: "/admin/dashboard/units", icon: "🏢" },
  { label: "Menu", path: "/admin/dashboard/menu", icon: "📋" },
  { label: "Orders", path: "/admin/dashboard/order", icon: "🍽️" },
  { label: "Add Staff", path: "/admin/dashboard/staff", icon: "👨‍🍳" },
     { label: "Feedback", path: "/admin/dashboard/feedback", icon: "⚙️" },
  { label: "Invoice", path: "/admin/dashboard/invoice", icon: "🧾" },
  { label: "Plan", path: "/admin/dashboard/planman", icon: "💳" },
   { label: "Settings", path: "/admin/dashboard/setting", icon: "⚙️" },
  // { label: "Plan", path: "/admin/dashboard/plan", icon: MdListAlt  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const businessName =
    localStorage.getItem("businessName") || "My Business";
const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="maincontainer">
      {/* ☰ MENU ICON */}
      <button className="menu-toggle" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* OVERLAY */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* LOGO + CLOSE */}
        <div className="sidebar-logo">
          <span className="logo-icon">🍽️</span>
          <h2>{businessName}</h2>
          <button className="close-btn" onClick={() => setOpen(false)}>✖</button>
        </div>

        {/* MENU */}
        <nav className="sidebar-menu">
          {sidebarMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
       <span className="menu-icon">
  {item.icon}
</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
