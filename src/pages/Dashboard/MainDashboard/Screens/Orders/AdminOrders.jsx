import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./adminOrders.css";
import API_URLS from "../../../../../services/api.js";
import { generateThermalInvoice } from "../utils/generateInvoice.js";

const socket = io("https://cafe-backend-28q0.onrender.com");

const AdminOrders = ({ businessCode }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING");
  const [invoiceConfig, setInvoiceConfig] = useState(null);
const [selectedUnit, setSelectedUnit] = useState("ALL");
const [showMoreTabs, setShowMoreTabs] = useState(false);

  // 🔐 ROLE
  const role = localStorage.getItem("role"); // admin | staff
  const isAdmin = role === "admin";
  const isStaff = role === "staff";

  /* ================= COUNTS ================= */
  const counts = {
    PENDING: orders.filter(o => o.orderStatus === "PENDING").length,
    APPROVED: orders.filter(o => o.orderStatus === "APPROVED").length,
    COMPLETED: orders.filter(
      o => o.orderStatus === "COMPLETED" && o.paymentStatus !== "PAID"
    ).length,
    REJECTED: orders.filter(o => o.orderStatus === "REJECTED").length,
    HISTORY: orders.filter(
      o => o.orderStatus === "COMPLETED" && o.paymentStatus === "PAID"
    ).length,
  };

  const staffApprovedCount = orders.filter(
    o => o.orderStatus === "APPROVED"
  ).length;

const unitList = [
  "ALL",
  ...Array.from(
    new Set(orders.map(o => o.unitName).filter(Boolean))
  ),
];
const generateCombinedInvoice = async () => {
  if (filteredOrders.length === 0) {
    alert("No orders to print");
    return;
  }

  // 🪑 Same unit (filter ke wajah se)
  const unitName = filteredOrders[0].unitName;

  // 🔁 Merge items
  const itemMap = {};

  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      if (!itemMap[item.name]) {
        itemMap[item.name] = {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        };
      } else {
        itemMap[item.name].quantity += item.quantity;
      }
    });
  });

  const mergedItems = Object.values(itemMap);

  // 💰 Total
  const totalAmount = mergedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🧾 Combined order object
const consolidatedOrder = {
  billNo: Date.now().toString().slice(-4), // TEMP
  unitName,
  items: mergedItems,
  totalAmount,
  paymentStatus: "PAID",
  createdAt: new Date(),
};


  try {
    /* 🖨️ 1️⃣ PRINT INVOICE */
    generateThermalInvoice(consolidatedOrder, {
      ...invoiceConfig,
      businessName: localStorage.getItem("businessName"),
      phone: invoiceConfig?.businessPhone || "",
      businessAddress: invoiceConfig?.businessAddress || {},
    });

    /* 💰 2️⃣ MARK ALL FILTERED ORDERS AS PAID */
    const unpaidOrders = filteredOrders.filter(
      o => o.paymentStatus !== "PAID"
    );

    await Promise.all(
      unpaidOrders.map(order =>
        axios.put(`${API_URLS.ORDER}/pay/${order._id}`)
      )
    );

    /* 🔄 3️⃣ UPDATE UI STATE */
    setOrders(prev =>
      prev.map(o =>
        unpaidOrders.some(u => u._id === o._id)
          ? { ...o, paymentStatus: "PAID" }
          : o
      )
    );

  } catch (err) {
    console.error("Combined invoice error:", err);
    alert("Failed to print & mark paid");
  }
};


  /* ================= FETCH INVOICE CONFIG ================= */
  const fetchInvoiceConfig = async () => {
    try {
      const res = await axios.get(
        `${API_URLS.INVOICE_CONFIG}/${businessCode}`
      );
      setInvoiceConfig(res.data);
    } catch {
      setInvoiceConfig({});
    }
  };

  /* ================= FILTER ORDERS ================= */
const filteredOrders = orders.filter(order => {

  /* 👨‍🍳 STAFF LOGIC */
  if (isStaff) {
    if (order.orderStatus !== "APPROVED") return false;

    if (selectedUnit !== "ALL" && order.unitName !== selectedUnit)
      return false;

    return true;
  }

  /* 🧑‍💼 ADMIN LOGIC */

  // unit filter
  if (selectedUnit !== "ALL" && order.unitName !== selectedUnit)
    return false;

  // 🔥 REJECTED TAB FIX
  if (activeTab === "REJECTED") {
    return order.orderStatus === "REJECTED";
  }

  // 📜 HISTORY
  if (activeTab === "HISTORY") {
    return (
      order.orderStatus === "COMPLETED" &&
      order.paymentStatus === "PAID"
    );
  }

  // 🍽 COMPLETED (unpaid)
  if (activeTab === "COMPLETED") {
    return (
      order.orderStatus === "COMPLETED" &&
      order.paymentStatus !== "PAID"
    );
  }

  // ⏳ PENDING / ✅ APPROVED
  return order.orderStatus === activeTab;
});




  /* ================= ACTIONS ================= */
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API_URLS.ORDER}/status/${orderId}`,
        { status }
      );

      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, orderStatus: status } : o
        )
      );
    } catch {
      alert("Failed to update order");
    }
  };

const markAsPaid = async (order) => {
  try {
    // 1️⃣ API call
    const res = await axios.put(
      `${API_URLS.ORDER}/pay/${order._id}`
    );

    const updatedOrder = res.data.order; // ✅ billNo yahin hai

    // 2️⃣ State update (ONLY ONCE)
    setOrders(prev =>
      prev.map(o =>
        o._id === updatedOrder._id
          ? { ...o, ...updatedOrder }
          : o
      )
    );

    // 3️⃣ Invoice UPDATED order se print karo
    generateThermalInvoice(
      updatedOrder,
      {
        ...invoiceConfig,
        businessName: localStorage.getItem("businessName"),
        phone: invoiceConfig?.businessPhone || "",
        businessAddress: invoiceConfig?.businessAddress || {},
      }
    );

  } catch (err) {
    console.error("Mark as paid error:", err);
    alert("Failed to mark payment");
  }
};


  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API_URLS.ORDER}/${businessCode}`
      );
      setOrders(res.data);
    } catch {
      setError("Failed to load orders");
    }
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    fetchOrders();
    fetchInvoiceConfig();

    socket.emit("join-business", businessCode);

    socket.on("new-order", order => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on("order-status-update", ({ orderId, status, paymentStatus }) => {
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId
            ? { ...o, orderStatus: status, paymentStatus }
            : o
        )
      );
    });

    socket.on("payment-updated", ({ orderId, paymentStatus, billNo }) => {
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId
            ? { ...o, paymentStatus, billNo}
            : o
        )
      );
    });

    return () => {
      socket.off("new-order");
      socket.off("order-status-update");
      socket.off("payment-updated");
    };
  }, [businessCode]);

  if (error) return <p className="error">{error}</p>;

  /* ================= UI ================= */
  return (
    <div className="admin-orders">
   
{filteredOrders.length > 0 && (
  <div style={{ marginTop: "1px", marginBottom:"10px",display:"flex", justifyContent:"center" }}>
  <button
    onClick={generateCombinedInvoice}
    style={{
      height:"35px",
      marginBottom:"20px",
      padding: "5px 16px",
      borderRadius: "8px",
      backgroundColor: "#5a8ea7",
      color: "white",
      fontWeight: "600",
      border: "none",
      cursor: "pointer"
    }}
  >
    🖨️ Print Combined
  </button>
  </div>
)}
      {/* ===== TABS ===== */}
     {/* ===== STATUS TABS ===== */}
{isAdmin && (
  <div className="nav">
   <div className="order-tabs">
 
<button
  className={activeTab === "PENDING" ? "active" : ""}
  onClick={() => {
    setActiveTab("PENDING");
    setShowMoreTabs(false);
  }}
>
    <span className="tab-text">New</span>
  <span className="icon-wrapper">
    <span className="tab-icon">⏳</span>

    {counts.PENDING > 0 && (
      <span className="icon-badge">{counts.PENDING}</span>
    )}
  </span>
</button>


  <button
    className={activeTab === "APPROVED" ? "active" : ""}
    onClick={() => {
      setActiveTab("APPROVED");
      setShowMoreTabs(false);
    }}
  >
<span className="tab-text">Preparing</span>
      <span className="icon-wrapper">
    <span className="tab-icon">✅</span>

    {counts.APPROVED > 0 && (
      <span className="icon-badge">{counts.APPROVED}</span>
    )}
  </span>

  </button>

  <button
    className={activeTab === "COMPLETED" ? "active" : ""}
    onClick={() => {
      setActiveTab("COMPLETED");
      setShowMoreTabs(false);
    }}
  >
<span className="tab-text">Completed</span>
       <span className="icon-wrapper">
    <span className="tab-icon">🍽</span>

    {counts.COMPLETED > 0 && (
      <span className="icon-badge">{counts.COMPLETED}</span>
    )}
  </span>

  </button>

      <div>
      <select
        value={selectedUnit}
        onChange={(e) => setSelectedUnit(e.target.value)}
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          fontWeight: "600",
          border: "1px solid #ccc",
          minWidth: "120px"
        }}
      >
        {unitList.map((unit, i) => (
          <option key={i} value={unit}>
            {unit === "ALL" ? "🪑 All Units" : `🪑 ${unit}`}
          </option>
        ))}
      </select>
    </div>
  {/* MORE BUTTON */}
  <button
    className={
      activeTab === "REJECTED" || activeTab === "HISTORY"
        ? "active"
        : ""
    }
    onClick={() => setShowMoreTabs(prev => !prev)}
  >
<span className="tab-icon">⋮</span>
<span className="tab-text">More</span>
  </button>
   

</div>
{showMoreTabs && (
  <div
   className="moreButton"
  >

    <button
      style={{
        width: "100%",
        padding: "8px",
        marginBottom: "6px",
        borderRadius: "6px",
        border: "none",
        background: activeTab === "REJECTED" ? "#dc2626" : "#e5e7eb",
        color: activeTab === "REJECTED" ? "white" : "black",
        fontWeight: "600",
        cursor: "pointer"
      }}
      onClick={() => {
        setActiveTab("REJECTED");
        setShowMoreTabs(false);
      }}
    >
      ❌ Rejected ({counts.REJECTED})
    </button>

    <button
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "6px",
        border: "none",
        background: activeTab === "HISTORY" ? "#2563eb" : "#e5e7eb",
        color: activeTab === "HISTORY" ? "white" : "black",
        fontWeight: "600",
        cursor: "pointer"
      }}
      onClick={() => {
        setActiveTab("HISTORY");
        setShowMoreTabs(false);
      }}
    >
      📜 History ({counts.HISTORY})
    </button>
  </div>
)}


    {/* ===== UNIT FILTER ===== */}



  </div>
)}


      {/* ===== ORDERS ===== */}
      {filteredOrders.length === 0 ? (
        <p className="empty">No orders</p>
      ) : (
        filteredOrders.map(order => (
          <div className="order-card-main">
          <div key={order._id} className="order-card">
            <div className="order-header">
              <b>🪑 {order.unitName}</b>

              {isAdmin && (
                <div className="badges">
                  <span className={`pay-badge ${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>
              )}
            </div>

            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} × ₹{item.price}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <span>
                ⏰ {new Date(order.createdAt).toLocaleTimeString()}
              </span>
              <span>💰 ₹{order.totalAmount}</span>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="order-actions">
              {isAdmin && order.orderStatus === "PENDING" && (
                <>
                  <button
                    onClick={() =>
                      updateStatus(order._id, "APPROVED")
                    }
                  >
                    ✅ Accept
                  </button>
                  <button
                  style={{backgroundColor:"#794747"}}
                    onClick={() =>
                      updateStatus(order._id, "REJECTED")
                    }
                  >
                    ❌ Reject
                  </button>
                </>
              )}

              {isStaff && order.orderStatus === "APPROVED" && (
                <button
                  style={{backgroundColor:"#60b92c"}}
                  onClick={() =>
                    updateStatus(order._id, "COMPLETED")
                  }
                >
                  🍽 Complete
                </button>
              )}

              {isAdmin &&
                order.orderStatus === "COMPLETED" &&
                order.paymentStatus !== "PAID" && (
                  <button
                  style={{backgroundColor:"#887022"}}
                    onClick={() => markAsPaid(order)}
                  >
                    💰 Mark as Paid
                  </button>
                )}
            </div>
          </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
