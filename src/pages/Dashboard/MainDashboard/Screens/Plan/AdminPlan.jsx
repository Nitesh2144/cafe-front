import React, { useState } from "react";
import axios from "axios";
import "./adminPlan.css";
import API_URLS from "../../../../../services/api";

const AdminPlan = ({ businessCode }) => {
  const [error, setError] = useState("");
const [loadingPlan, setLoadingPlan] = useState(null);

const payNow = async (planType) => {
  try {
    setLoadingPlan(planType);
    setError("");

    const res = await axios.post(
      `${API_URLS.PAYMENT}/create-order`,
      { businessCode, planType }
    );

    const options = {
      key: res.data.key,
      amount: res.data.amount,
      currency: "INR",
      name: "Menu Service",
      description: `${planType} Plan Subscription`,
      order_id: res.data.orderId,



      handler: async function (response) {
        try {
          await axios.post(`${API_URLS.PAYMENT}/verify`, {
            ...response,
            businessCode,
            planType,
          });

          alert("✅ Plan activated successfully");
          window.location.reload();
        } catch (err) {
          setError("Payment verification failed");
          setLoadingPlan(null);
        }
      },

      modal: {
        ondismiss: function () {
          setLoadingPlan(null);
        },
      },

      theme: { color: "#111" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    setError("Payment failed. Please try again.");
    setLoadingPlan(null);
  }
};



  return (
    <div className="plan-container">
      <h2>💳 Choose Your Plan</h2>

      {error && <p className="error">{error}</p>}

      <div className="plans">
        {/* CAFE PLAN */}
        <div className="plan-card">
          <h3>☕ Café Plan</h3>
          <p className="price">₹499 / month</p>
          <ul>
            <li>Unlimited orders</li>
            <li>Table-wise QR</li>
            <li>Live order tracking</li>
            <li>Basic dashboard</li>
          </ul>
<button
  disabled={loadingPlan === "CAFE"}
  onClick={() => payNow("CAFE")}
>
  {loadingPlan === "CAFE" ? "Processing..." : "Pay ₹499"}
</button>


        </div>

        {/* RESTAURANT PLAN */}
        <div className="plan-card premium">
          <h3>🍽️ Restaurant Plan</h3>
          <p className="price">₹999 / month</p>
          <ul>
            <li>Everything in Café</li>
            <li>Staff panel</li>
            <li>Reports & analytics</li>
            <li>Priority support</li>
          </ul>
    <button
  disabled={loadingPlan === "RESTAURANT"}
  onClick={() => payNow("RESTAURANT")}
>
  {loadingPlan === "RESTAURANT" ? "Processing..." : "Pay ₹999"}
</button>

        </div>
      </div>
    </div>
  );
};

export default AdminPlan;
