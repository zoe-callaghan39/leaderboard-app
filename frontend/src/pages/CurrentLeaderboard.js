import { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://leaderboard-app-v48a.onrender.com";

export default function CurrentLeaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    setData([]); // clear stale data immediately

    axios
      .get(`${API_BASE}/leaderboard/current?nocache=${Date.now()}`) // cache-busting
      .then((res) => {
        const freshData = res.data || [];
        console.log("✅ Response:", freshData);
        setData(freshData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch current leaderboard:", err);
        setData([]);
        setLoading(false);
      });
  }, [currentMonth]);

  return (
    <div>
      <h2 style={{ padding: "1rem" }}>Current Leaderboard</h2>
      {loading ? (
        <p style={{ padding: "1rem" }}>Loading...</p>
      ) : data.length === 0 ? (
        <p style={{ padding: "1rem" }}>
          No scores have been added yet this month.
        </p>
      ) : (
        <Leaderboard key={currentMonth} data={data} title="" />
      )}
    </div>
  );
}
