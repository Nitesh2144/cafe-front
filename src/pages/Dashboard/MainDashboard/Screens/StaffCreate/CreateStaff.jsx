import { useEffect, useState } from "react";
import axios from "axios";
import "./staff.css";
import { API_URLS } from "../../../../../services/api.js";
const CreateStaff = () => {
  const [activeTab, setActiveTab] = useState("create");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [staffList, setStaffList] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= CREATE STAFF ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createStaff = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URLS.LOGIN}/staff/create`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Staff Created Successfully");
      setForm({ username: "", email: "", password: "" });
      loadStaff();
      setActiveTab("view");
    } catch (err) {
      alert("Error creating staff");
    }
  };
  const deleteStaff = async (staffId) => {
  if (!window.confirm("Delete this staff permanently?")) return;

  try {
    await axios.delete(
      `${API_URLS.LOGIN}/staff/${staffId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    loadStaff(); // refresh list
  } catch (err) {
    alert("Failed to delete staff");
  }
};
const resetPassword = async (staffId) => {
  const newPassword = window.prompt("Enter new password for staff");

  if (!newPassword) return;

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    await axios.put(
      `${API_URLS.LOGIN}/staff/reset-password/${staffId}`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Password updated successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to reset password");
  }
};

  /* ================= VIEW STAFF ================= */
  const loadStaff = async () => {
    try {
      const res = await axios.get(`${API_URLS.LOGIN}/staff/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStaffList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "view") loadStaff();
  }, [activeTab]);

  return (
    <div className="staff-container">
      <h2>Staff Management</h2>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          ➕ Create Staff
        </button>
        <button
          className={activeTab === "view" ? "active" : ""}
          onClick={() => setActiveTab("view")}
        >
          👀 View Staff
        </button>
      </div>

      {/* CREATE STAFF */}
      {activeTab === "create" && (
        <form className="card" onSubmit={createStaff}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Create Staff</button>
        </form>
      )}

      {/* VIEW STAFF */}
      {activeTab === "view" && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={staff._id}>
                  <td>{index + 1}</td>
                  <td>{staff.username}</td>
                  <td>{staff.email}</td>
                  <td>{staff.role}</td>
                  <td>
  <button
    className="btn reset"
    onClick={() => resetPassword(staff._id)}
  >
    🔁 Reset Password
  </button>

  <button
    className="btn delete"
    onClick={() => deleteStaff(staff._id)}
  >
    ❌ Delete
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



export default CreateStaff;
