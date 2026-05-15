import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#fff",
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
        }}
      >
        <h2 style={{ margin: 0, color: "#111" }}>Order On Table</h2>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            marginBottom: "20px",
            color: "#111",
            maxWidth: "800px",
          }}
        >
          Smart QR Ordering System For Restaurants & Cafes
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#555",
            maxWidth: "700px",
            lineHeight: "1.7",
          }}
        >
          Customers scan QR codes to place orders directly from their phones.
          Restaurant owners manage menus, tables, orders, and kitchen operations
          through a powerful dashboard.
        </p>

        <div
          style={{
            marginTop: "35px",
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 28px",
              border: "none",
              borderRadius: "10px",
              background: "#111",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Get Started
          </button>

          <button
            style={{
              padding: "14px 28px",
              borderRadius: "10px",
              border: "2px solid #111",
              background: "transparent",
              color: "#111",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            View Features
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          padding: "50px 20px 100px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "50px",
            fontSize: "36px",
            color: "#111",
          }}
        >
          Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
          }}
        >
          {[
            "QR Based Ordering",
            "Live Kitchen Dashboard",
            "Restaurant Admin Panel",
            "Digital Menu System",
            "Staff Management",
            "Real-Time Orders",
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ marginBottom: "12px", color: "#111" }}>
                {item}
              </h3>

              <p style={{ color: "#666", lineHeight: "1.6" }}>
                Powerful and modern tools designed for restaurants and cafes to
                simplify ordering and management.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
     {/* FOOTER */}
<footer
  style={{
    background: "#111",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
  }}
>
  <h3>Order On Table</h3>

  <p style={{ color: "#bbb", marginTop: "10px" }}>
    QR Based Restaurant Ordering Platform
  </p>

  {/* CONTACT DETAILS */}
  <div style={{ marginTop: "20px", lineHeight: "2" }}>
    <p>
      📱 WhatsApp: +91 6263515604
    </p>
    <p>
      📧 Email: techshowerofficial@gmail.com
    </p>

  </div>

  {/* FOOTER LINKS */}
  <div
    style={{
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
    }}
  >
<Link to="/privacy-policy">Privacy Policy</Link>
<Link to="/terms-and-conditions">Terms & Conditions</Link>
<Link to="/refund-policy">Refund Policy</Link>
<Link to="/contact">Contact</Link>
  </div>

  <p style={{ marginTop: "20px", color: "#888" }}>
    © 2026 Order On Table. All rights reserved..
  </p>
</footer>
    </div>
  );
};

export default Home;