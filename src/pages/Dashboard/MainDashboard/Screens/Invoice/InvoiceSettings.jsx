import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URLS from "../../../../../services/api.js";
import "./invoiceSettings.css"
const defaultConfig = {
  themeColor: "#6c5ce7",
  showGST: true,
  gstPercent: 5,
  showPaymentStatus: true,
  showUnitName: true,
  invoicePrefix: "INV-",
  footerText: "Thank you for your visit!",
  businessPhone: "",

    businessAddress: {
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  },
};


const InvoiceSettings = ({  businessCode }) => {
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
axios.get(`${API_URLS.INVOICE_CONFIG}/${businessCode}`)
      .then(res => {
        if (res.data) {
          setConfig({ ...defaultConfig, ...res.data });
        }
      });
  }, [businessCode]);

  const saveConfig = async () => {
    await axios.put(`${API_URLS.INVOICE_CONFIG}/${businessCode}`, config)
    alert("Invoice settings saved");
  };

return (
  <div className="invoice-settings" style={{ padding: 20 }}>
    <h2 className="invoice-title">🧾 Invoice Settings</h2>

    <label className="form-label">Theme Color</label>
    <input
      className="form-input form-color"
      type="color"
      value={config.themeColor}
      onChange={e =>
        setConfig({ ...config, themeColor: e.target.value })
      }
    />

    <label className="form-label">Business Phone Number</label>
    <input
      className="form-input"
      type="text"
      placeholder="Enter phone number"
      value={config.businessPhone}
      onChange={e =>
        setConfig({ ...config, businessPhone: e.target.value })
      }
    />

    <h4 className="section-title">🏠 Business Address</h4>

    <input
      className="form-input"
      type="text"
      placeholder="Street / Shop No"
      value={config.businessAddress.street}
      onChange={e =>
        setConfig({
          ...config,
          businessAddress: {
            ...config.businessAddress,
            street: e.target.value,
          },
        })
      }
    />

    <input
      className="form-input"
      type="text"
      placeholder="Area / Locality"
      value={config.businessAddress.area}
      onChange={e =>
        setConfig({
          ...config,
          businessAddress: {
            ...config.businessAddress,
            area: e.target.value,
          },
        })
      }
    />

    <input
      className="form-input"
      type="text"
      placeholder="City"
      value={config.businessAddress.city}
      onChange={e =>
        setConfig({
          ...config,
          businessAddress: {
            ...config.businessAddress,
            city: e.target.value,
          },
        })
      }
    />

    <input
      className="form-input"
      type="text"
      placeholder="State"
      value={config.businessAddress.state}
      onChange={e =>
        setConfig({
          ...config,
          businessAddress: {
            ...config.businessAddress,
            state: e.target.value,
          },
        })
      }
    />

    <input
      className="form-input"
      type="text"
      placeholder="Pincode"
      value={config.businessAddress.pincode}
      onChange={e =>
        setConfig({
          ...config,
          businessAddress: {
            ...config.businessAddress,
            pincode: e.target.value,
          },
        })
      }
    />

    <label className="form-label">Invoice Prefix</label>
    <input
      className="form-input"
      value={config.invoicePrefix}
      onChange={e =>
        setConfig({ ...config, invoicePrefix: e.target.value })
      }
    />

    <label className="form-label">Footer Text</label>
    <input
      className="form-input"
      value={config.footerText}
      onChange={e =>
        setConfig({ ...config, footerText: e.target.value })
      }
    />

    <label className="form-label checkbox-label">
      <input
        className="form-checkbox"
        type="checkbox"
        checked={config.showGST}
        onChange={e =>
          setConfig({ ...config, showGST: e.target.checked })
        }
      />
      Show GST
    </label>

    <input
      className="form-input"
      type="number"
      value={config.gstPercent}
      onChange={e =>
        setConfig({ ...config, gstPercent: Number(e.target.value) })
      }
    />

    <label className="form-label checkbox-label">
      <input
        className="form-checkbox"
        type="checkbox"
        checked={config.showPaymentStatus}
        onChange={e =>
          setConfig({
            ...config,
            showPaymentStatus: e.target.checked,
          })
        }
      />
      Show Payment Status
    </label>
    <br />

    <button className="save-btn" onClick={saveConfig}>
      💾 Save
    </button>
  </div>
);

};

export default InvoiceSettings;
