import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (error) {
        console.log("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>CyberArena</h2>
        <p className="active">Dashboard</p>
        <p>Challenges</p>
        <p>Leaderboard</p>
        <p>Profile</p>
      </div>

      {/* Main Content */}
      <div className="main">
        <h1>Welcome Back 👋</h1>

        <div className="card-grid">
          <div className="card">
            <h3>Name</h3>
            <p>{user?.name}</p>
          </div>

          <div className="card">
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>

          <div className="card">
            <h3>Status</h3>
            <p className="status">Active User</p>
          </div>

          <div className="card">
            <h3>Role</h3>
            <p>CTF Player</p>
          </div>
        </div>
      </div>
    </div>
  );
}