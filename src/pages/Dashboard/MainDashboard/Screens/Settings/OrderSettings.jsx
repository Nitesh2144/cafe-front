import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../../../services/api.js";
import "./settings.css";

const OrderSettings = ({ businessCode }) => {
  const [enableItemNote, setEnableItemNote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessCode) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await axios.get(
          `${API_URLS.MENU}/settings/${businessCode}`
        );

        setEnableItemNote(res.data?.enableItemNote ?? false);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [businessCode]);

  const handleToggle = async () => {
    const newValue = !enableItemNote;
    setEnableItemNote(newValue);

    try {
      await axios.patch(`${API_URLS.MENU}/order-settings`, {
        businessCode,
        enableItemNote: newValue,
      });
    } catch (error) {
      console.error("Update failed", error);
      setEnableItemNote(!newValue); // rollback
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="settings-page">
      <h2>⚙️ Order Settings</h2>

      <div className="setting-card">
        <div>
          <h4>Item Notes</h4>
          <p>Allow customers to add special instructions</p>
        </div>

        <label className="switch">
          <input
            type="checkbox"
            checked={enableItemNote}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="coming-soon">
        More settings coming soon...
      </div>
    </div>
  );
};

export default OrderSettings;
