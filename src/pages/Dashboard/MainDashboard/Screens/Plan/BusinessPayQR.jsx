import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import API_URLS from "../../../../../services/api.js";
import "./PayPlanQR.css";

const BusinessPayQR = ({ businessCode }) => {
 const [duration, setDuration] = useState("YEARLY");
  const [upiUrl, setUpiUrl] = useState("");
  const [amount, setAmount] = useState(0);
const [loading, setLoading] = useState(false);
const [business, setBusiness] = useState(null);
const [paidSubmitting, setPaidSubmitting] = useState(false);

  const businessType = localStorage.getItem("businessType"); 
  // CAFE / RESTAURANT

useEffect(() => {
  if (!businessCode || !businessType || !duration) return;

  generateQR();
}, [duration, businessType, businessCode]);


const generateQR = async () => {
  try {
    setLoading(true);
const token = localStorage.getItem("token");

const res = await axios.post(
  `${API_URLS.MANUALLYPAY}/generate-qr`,
  {
    businessCode,
    businessType,
    planType: duration,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

    setUpiUrl(res.data.upiUrl);
    setAmount(res.data.amount);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchBusiness();
}, []);

const fetchBusiness = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${API_URLS.MANUALLYPAY}/by-code/${businessCode}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  setBusiness(res.data);
};

const getRemainingDays = () => {
  if (!business?.planEndDate) return null;

  const today = new Date();
  const endDate = new Date(business.planEndDate);

  const diff = endDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

return (
  <div className="payqr-page">
    <div className="payqr-layout">
      
      {/* ⬅ LEFT : PLAN DETAILS */}
      <div className="plan-left">
        <h3 className="section-title">📦 Current Plan</h3>
{business?.isTrialActive && business?.trialEndDate && (
  <>
    <p className="trial-text">
      🆓 Free Trial ends on:{" "}
      {new Date(business.trialEndDate).toDateString()}
    </p>

    <p className="trial-days">
      ⏳ {Math.max(
        0,
        Math.ceil(
          (new Date(business.trialEndDate) - new Date()) /
          (1000 * 60 * 60 * 24)
        )
      )} days left
    </p>
  </>
)}


        {business?.isPlanActive ? (
          <div className="plan-status-card">
            <p><b>Plan:</b> {business.planType}</p>
            <p><b>Start Date:</b> {new Date(business.planStartDate).toDateString()}</p>
            <p><b>End Date:</b> {new Date(business.planEndDate).toDateString()}</p>

            <p className={getRemainingDays() <= 3 ? "danger-text" : "success-text"}>
              ⏳ {getRemainingDays()} days remaining
            </p>
          </div>
        ) : (
          <div className="plan-status-card expired">
            ❌ No active plan
          </div>
        )}
      </div>

      {/* ➡ RIGHT : RECHARGE */}
      <div className="payqr-right">
        <h3 className="section-title">💳 Recharge Plan</h3>

<div className="tab-switch">
  <button
    className={duration === "HALF_YEARLY" ? "active" : ""}
    onClick={() => setDuration("HALF_YEARLY")}
  >
    6 Months
  </button>

  <button
    className={duration === "YEARLY" ? "active" : ""}
    onClick={() => setDuration("YEARLY")}
  >
    Yearly ⭐
  </button>
</div>




        {/* QR */}
        <div className="qr-box">
          {loading ? (
            <p>Generating QR...</p>
          ) : (
            upiUrl && <QRCodeSVG value={upiUrl} size={200} />
          )}
        </div>

        <p className="price-text">
          ₹{amount} – {businessType} {duration}
        </p>

        {duration === "YEARLY" && (
          <p className="save-text">🎉 Save 2 months with yearly plan</p>
        )}

        <small className="note-text">
          Scan & pay → Plan activates after admin approval
        </small>

       <button
  className="payqr-confirm-btn"
  disabled={paidSubmitting}
  onClick={async () => {
    const token = localStorage.getItem("token");
    try {
      setPaidSubmitting(true);

      await axios.post(
        `${API_URLS.MANUALLYPAY}/user-paid`,
        {
          businessCode,
          businessType,
          planType: duration,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Payment submitted for admin approval");
    } catch (err) {
      alert("❌ Something went wrong");
    } finally {
      setPaidSubmitting(false);
    }
  }}
>
  
          {paidSubmitting ? "Submitting..." : "I Have Paid"}
        </button>
      </div>
    </div>
  </div>
);

};

export default BusinessPayQR;
