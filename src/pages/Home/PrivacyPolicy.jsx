import React from "react";
import "./LegalPages.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-card">

        <h1 className="legal-title">Privacy Policy</h1>

        <p className="legal-text">
          Order On Table values your privacy and is committed to protecting your
          personal information.
        </p>

        <h2 className="legal-subtitle">Information We Collect</h2>

        <p className="legal-text">
          We may collect restaurant information, customer order details,
          contact information, and payment-related information for service
          functionality.
        </p>

        <h2 className="legal-subtitle">How We Use Information</h2>

        <p className="legal-text">
          Information is used to manage restaurant orders, improve user
          experience, provide support, and maintain platform security.
        </p>

        <h2 className="legal-subtitle">Payment Security</h2>

        <p className="legal-text">
          Payments are securely processed through Razorpay. We do not store
          card or banking details.
        </p>

        <div className="legal-contact">
          <h2 className="legal-subtitle">Contact Us</h2>

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

export default PrivacyPolicy;