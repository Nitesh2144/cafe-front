import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../../services/api.js";
import "./login.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Email/Username and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");
     

      const res = await axios.post(`${API_URLS.LOGIN}/login`, {
        identifier,
        password,
      });

      const { token, user } = res.data;
      const role = user.role.toLowerCase();

      // 🔐 ONLY SAVE DATA
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      localStorage.setItem("businessId", user.business.id);
localStorage.setItem("businessCode", user.business.code); 
localStorage.setItem("businessName", user.business.name); 
localStorage.setItem("businessType", user.business.type);
if (role === "admin") {
  window.location.replace("/admin/dashboard");
} else if (role === "staff") {
  window.location.replace("/staff/dashboard");
}


    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2> Login ☕</h2>

        <input
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}
     

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
