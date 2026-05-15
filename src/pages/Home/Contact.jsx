import React from "react";
import "./LegalPages.css";

const Contact = () => {
  return (
    <div className="legal-page">
      <div className="legal-card">

        <h1 className="legal-title">Contact Us</h1>

        <p className="legal-text">
          For support, business inquiries, or technical assistance, contact us.
        </p>

        <div className="legal-contact">

          <h2 className="legal-subtitle">Email</h2>

          <p className="legal-contact-text">
            📧 techshowerofficial@gmail.com
          </p>

          <h2 className="legal-subtitle">WhatsApp</h2>

          <p className="legal-contact-text">
            📱 +91 6263515604
          </p>

        </div>

      </div>
    </div>
  );
};

export default Contact;