import { useEffect, useState } from "react";
import api from "../api/api";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard"); 
        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;