import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../../../../services/api.js";
import "./settings.css";

const OrderSettings = ({ businessCode }) => {
  const [enableItemNote, setEnableItemNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enableFeedback, setEnableFeedback] = useState(false);
  const [allowEarlyFeedback, setAllowEarlyFeedback] = useState(false);
const [savingFeedback, setSavingFeedback] = useState(false);
const [savingEarlyFeedback, setSavingEarlyFeedback] = useState(false);


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

        setEnableItemNote(res.data?.orderSettings?.enableItemNote ?? false);
        setEnableFeedback(res.data?.feedbackSettings?.enableFeedback ?? false);
        setAllowEarlyFeedback(
          res.data?.feedbackSettings?.allowBeforeCompletion ?? false
        );

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
const toggleFeedback = async () => {
  setSavingFeedback(true);
  try {
    const res = await axios.patch(
      `${API_URLS.FEEDBACK}/feedback-settings`, // ✅ CORRECT
      {
        businessCode,
        enableFeedback: !enableFeedback,
      }
    );

    setEnableFeedback(res.data.feedbackSettings.enableFeedback);
    setAllowEarlyFeedback(
      res.data.feedbackSettings.allowBeforeCompletion
    );
  } catch (err) {
    console.error(
      "Feedback toggle failed",
      err.response?.data || err
    );
  } finally {
    setSavingFeedback(false);
  }
};

const toggleEarlyFeedback = async () => {
  setSavingEarlyFeedback(true);
  try {
    const res = await axios.patch(
      `${API_URLS.FEEDBACK}/feedback-settings`, // ✅ SAME ROUTE
      {
        businessCode,
        allowBeforeCompletion: !allowEarlyFeedback,
      }
    );

    setAllowEarlyFeedback(
      res.data.feedbackSettings.allowBeforeCompletion
    );
  } catch (err) {
    console.error(
      "Early feedback toggle failed",
      err.response?.data || err
    );
  } finally {
    setSavingEarlyFeedback(false);
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
      <div className="setting-card">
        <div>
          <h4>Customer Feedback</h4>
          <p>Allow customers to give feedback</p>
        </div>

<label className="switch">
  <input
    type="checkbox"
    checked={enableFeedback}
    disabled={savingFeedback}
    onChange={toggleFeedback}
  />
  <span className="slider"></span>
</label>



      </div>

{enableFeedback && (
<div className="setting-card">
  <div>
    <h4>Early Feedback</h4>
    <p>Allow feedback before order completion</p>

    {!enableFeedback && (
      <div className="hint-text">
        Enable “Customer Feedback” first
      </div>
    )}
  </div>

  <label
    className={`switch ${
      !enableFeedback ? "switch-hint" : ""
    }`}
  >
    <input
      type="checkbox"
      checked={allowEarlyFeedback}
      onChange={() => {
        if (!enableFeedback) return; // ⛔ hard stop
        toggleEarlyFeedback();
      }}
    />
    <span className="slider"></span>
  </label>
</div>

)}

      <div className="coming-soon">
        More settings coming soon...
      </div>                  
    </div>
  );
};

export default OrderSettings;
