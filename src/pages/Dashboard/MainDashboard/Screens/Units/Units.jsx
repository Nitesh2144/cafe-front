import React, { useEffect, useState } from "react";
import axios from "axios";
import "./units.css";
import { API_URLS } from "../../../../../services/api.js";

const Units = ({ businessId }) => {
  const [units, setUnits] = useState([]);
  const [editId, setEditId] = useState(null);
  const [qrData, setQrData] = useState(null);
const [printUnits, setPrintUnits] = useState([]);
const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    unitName: "",
    unitCode: "",
    unitType: "",
    capacity: "",
  });

  const printAllQRs = () => {
  const qrUnits = units.filter(u => u.qrImage);

  if (qrUnits.length === 0) {
    alert("No QR codes available");
    return;
  }

  setPrintUnits(qrUnits);

  setTimeout(() => {
    window.print();
    setPrintUnits([]);
  }, 300);
};

  /* ================= GET UNITS ================= */
  const fetchUnits = async () => {
    try {
      const res = await axios.get(
        `${API_URLS.UNIT}?businessId=${businessId}`
      );
      setUnits(res.data);
    } catch (err) {
      alert("Failed to load units");
    }
  };

  useEffect(() => {
    if (businessId) fetchUnits();
  }, [businessId]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= ADD / EDIT UNIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessId) {
      alert("Business ID missing");
      return;
    }

    try {
      if (editId) {
        // EDIT
        await axios.put(`${API_URLS.UNIT}/edit`, {
          businessId,
          unitId: editId,
          unitName: form.unitName,
          unitType: form.unitType,
          capacity: Number(form.capacity),
        });
        alert("Unit updated");
      } else {
        // ADD
        await axios.post(`${API_URLS.UNIT}/add`, {
          businessId,
          unitName: form.unitName,
          unitCode: form.unitCode,
          unitType: form.unitType,
          capacity: Number(form.capacity),
        });
        alert("Unit added");
      }

      setForm({
        unitName: "",
        unitCode: "",
        unitType: "",
        capacity: "",
      });
      setShowForm(false); 
      setEditId(null);
      fetchUnits();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  /* ================= EDIT CLICK ================= */
const handleEdit = (unit) => {
  setEditId(unit._id);
  setShowForm(true); 
  setForm({
    unitName: unit.unitName,
    unitCode: unit.unitCode,
    unitType: unit.unitType,
    capacity: unit.capacity,
  });
};


  /* ================= DELETE ================= */
  const handleDelete = async (unitId) => {
    if (!window.confirm("Delete this unit?")) return;

    try {
      await axios.delete(`${API_URLS.UNIT}/delete`, {
        data: { businessId, unitId },
      });
      fetchUnits();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= GENERATE QR (SAVE IN DB) ================= */
  const generateQR = async (unitCode) => {
    try {
      const res = await axios.get(`${API_URLS.QR}/unit`, {
        params: { businessId, unitCode },
      });

      setQrData(res.data);
      fetchUnits(); // refresh to get saved QR
    } catch (err) {
      alert("QR generation failed");
    }
  };

  /* ================= VIEW QR ================= */
const viewQR = (unit) => {
  setQrData({
    qrImage: unit.qrImage,
    unitCode: unit.unitCode, // 🔥 IMPORTANT
  });
};


  /* ================= PRINT ONLY QR ================= */
const printQR = () => {
  if (!qrData) return;

  const win = window.open("", "", "width=400,height=500");

  win.document.write(`
    <html>
      <head>
        <title>Print QR</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          img {
            width: 260px;
            height: 260px;
          }
          .code {
            margin-top: 12px;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 2px;
          }
        </style>
      </head>
      <body>
        <img src="${qrData.qrImage}" />
        <div class="code">${qrData.unitCode.toUpperCase()}</div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
  win.close();
};

  return (
    <div className="units-page">
      <h2>Business Units</h2>
<div style={{display:"flex", justifyContent:"space-between"}}>
      {/* ===== FORM ===== */}
{showForm && (
  <div className="unit-overlay">
    <div className="unit-modal">
      <h3>{editId ? "Edit Unit" : "Add Unit"}</h3>

      <form onSubmit={handleSubmit} className="unit-form">
        <input
          name="unitName"
          placeholder="Unit Name"
          value={form.unitName}
          onChange={handleChange}
          required
        />

        <input
          name="unitCode"
          placeholder="Unit Code"
          value={form.unitCode}
          onChange={handleChange}
          disabled={!!editId}
          required
        />

        <select
          name="unitType"
          value={form.unitType}
          onChange={handleChange}
          required
        >
          <option value="">Select Unit Type</option>
          <option value="Table">Table</option>
          <option value="Room">Room</option>
          <option value="Counter">Counter</option>
        </select>

        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button type="submit">
            {editId ? "Update Unit" : "Save Unit"}
          </button>

          <button
            type="button"
            className="btn danger"
            onClick={() => {
              setShowForm(false);
              setEditId(null);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}



</div>
<div className="table-x-scroll">
      {/* ===== LIST ===== */}
      <table className="unit-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Action</th>
            <th>QR</th>
          </tr>
        </thead>

        <tbody>
          {units.map((u) => (
            <tr className="tabledata" key={u._id}>
              <td>{u.unitName}</td>
              <td>{u.unitCode}</td>
              <td>{u.unitType}</td>
              <td>{u.capacity ?? "-"}</td>
              <td>
              <button className="btn edit" onClick={() => handleEdit(u)}>Edit</button>
<button className="btn danger" onClick={() => handleDelete(u._id)}>Delete</button>



              </td>
              <td>
                {u.qrImage ? (
                  <>
                    <button className="btn view"  onClick={() => viewQR(u)}>View</button>

                  </>
                ) : (
                  <button className="btn generate" onClick={() => generateQR(u.unitCode)}>
                    Generate
                  </button>
                )}
              </td>
            </tr>
          ))}

          {units.length === 0 && (
            <tr>
              <td colSpan="6">No units found</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

<div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
  <button
    className="btn add"
    onClick={() => {
      setShowForm(true);
      setEditId(null);
      setForm({
        unitName: "",
        unitCode: "",
        unitType: "",
        capacity: "",
      });
    }}
  >
    ➕ Add Unit
  </button>

  <button className="btn print" onClick={printAllQRs}>
    🧾 Print A4 QR Sheet
  </button>
</div>
      {/* ===== QR MODAL ===== */}
{qrData && (
  <div className="qr-modal">
    <div className="qr-content">
      <button className="qr-close" onClick={() => setQrData(null)}>
        ✕
      </button>

      <img src={qrData.qrImage} alt="QR" />
      <div className="qr-unit-code">
        {qrData.unitCode.toUpperCase()}
      </div>

      <button className="btn print" onClick={printQR}>
        🖨 Print
      </button>
    </div>
  </div>
)}
{printUnits.length > 0 && (
  <div className="a4-print">
    {printUnits.map((u) => (
      <div key={u._id} className="qr-item">
        <img src={u.qrImage} alt={u.unitCode} />
        <div className="qr-code-text">
          {u.unitCode.toUpperCase()}
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default Units;
