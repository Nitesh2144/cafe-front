import React from "react";
import "./LegalPages.css";

const TermsConditions = () => {
  return (
    <div className="legal-page">
      <div className="legal-card">

        <h1 className="legal-title">Terms & Conditions</h1>

        <p className="legal-text">
          By using Order On Table, you agree to comply with these terms and
          conditions.
        </p>

        <h2 className="legal-subtitle">Service Usage</h2>

        <p className="legal-text">
          Our platform provides QR-based restaurant ordering and management
          services for restaurants and cafes.
        </p>

        <h2 className="legal-subtitle">User Responsibility</h2>

        <p className="legal-text">
          Restaurant owners are responsible for menu accuracy, pricing,
          taxes, and order fulfillment.
        </p>

        <h2 className="legal-subtitle">Account Access</h2>

        <p className="legal-text">
          Users are responsible for maintaining the confidentiality of their
          login credentials.
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

export default TermsConditions;