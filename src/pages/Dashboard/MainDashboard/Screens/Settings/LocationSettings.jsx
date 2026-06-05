import React, { useState, useEffect  } from "react";
import axios from "axios";
import { API_URLS } from "../../../../../services/api.js";
const LocationSettings = ({ businessCode }) => {
  const [enabled, setEnabled] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(100);
  const [loading, setLoading] = useState(false);
  

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        alert("Location access denied");
      }
    );
  };

  const saveLocation = async () => {
    try {
      setLoading(true);

      await axios.post(`${API_URLS.LOCATION}/save`, {
        businessCode,
        enabled,
        latitude,
        longitude,
        radius,
      });

      alert("Location settings saved");
    } catch (error) {
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  if (!businessCode) return;

  const loadLocationSettings = async () => {
    try {
      const res = await axios.get(
        `${API_URLS.LOCATION}/${businessCode}`
      );

      const data = res.data?.data;

      if (!data) return;

      setEnabled(data.enabled ?? false);
      setLatitude(data.latitude ?? "");
      setLongitude(data.longitude ?? "");
      setRadius(data.radius ?? 100);
    } catch (err) {
      console.error(err);
    }
  };

  loadLocationSettings();
}, [businessCode]);
return (
  <>
    <div className="setting-card">
      <div>
        <h4>Location Restriction</h4>
        <p>
          Allow orders only within a selected radius
          from your business location
        </p>
      </div>

      <label className="switch">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
    </div>

    {enabled && (
      <div className="setting-card location-settings">
        <button
          className="location-btn"
          onClick={getCurrentLocation}
        >
          📍 Set Current Location
        </button>

        <div className="location-inputs">
          <input
            type="text"
            value={latitude}
            readOnly
            placeholder="Latitude"
          />

          <input
            type="text"
            value={longitude}
            readOnly
            placeholder="Longitude"
          />
        </div>

        <div className="radius-wrapper">
          <label>Allowed Radius</label>

          <select
            value={radius}
            onChange={(e) =>
              setRadius(Number(e.target.value))
            }
          >
            <option value={50}>50 Meter</option>
            <option value={100}>100 Meter</option>
            <option value={150}>150 Meter</option>
            <option value={200}>200 Meter</option>
            <option value={300}>300 Meter</option>
          </select>
        </div>

        <button
          className="save-location-btn"
          onClick={saveLocation}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    )}
  </>
);
};

export default LocationSettings;