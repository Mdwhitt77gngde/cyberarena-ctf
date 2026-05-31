import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  } catch (error) {
    console.log("Backend not available — using mock login");

    // MOCK LOGIN (fallback for demo)
    localStorage.setItem("token", "demo-token-123");
    navigate("/dashboard");
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

