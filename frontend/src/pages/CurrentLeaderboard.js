import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";

export default function CurrentLeaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }, []);

  useEffect(() => {
    console.log("🌐 Fetching leaderboard for:", currentMonth);
    setLoading(true);
    setData([]);

    axios
      .get(
        `https://leaderboard-app-v48a.onrender.com/leaderboard/current?nocache=${Date.now()}`
      )
      .then((res) => {
        const freshData = res.data || [];
        console.log("✅ Response:", freshData);
        setData(freshData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch leaderboard:", err);
        setData([]);
        setLoading(false);
      });
  }, [currentMonth]);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading...</p>;
  }

  if (data.length === 0) {
    return (
      <div>
        <h2 style={{ padding: "1rem" }}>Current Leaderboard</h2>
        <p style={{ padding: "1rem" }}>
          No scores have been added yet this month.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ padding: "1rem" }}>Current Leaderboard</h2>
      <Leaderboard key={currentMonth} data={data} title="" />
    </div>
  );
}
