import React from "react";
import "./LegalPages.css";

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-card">

        <h1 className="legal-title">Refund Policy</h1>

        <p className="legal-text">
          Refund requests are reviewed on a case-by-case basis.
        </p>

        <h2 className="legal-subtitle">Subscription Payments</h2>

        <p className="legal-text">
          Subscription or service payments once processed may not be refundable
          unless approved by our support team.
        </p>

        <h2 className="legal-subtitle">Technical Issues</h2>

        <p className="legal-text">
          If users face technical issues caused by our platform, we will make
          reasonable efforts to resolve them.
        </p>

        <div className="legal-contact">
          <h2 className="legal-subtitle">Contact</h2>

          <p className="legal-contact-text">
            📧 techshowerofficial@gmail.com
          </p>

          <p className="legal-contact-text">
            📱 +91 6263515604
          </p>
        </div>

      </div>
    </div>
  );
};

export default RefundPolicy;