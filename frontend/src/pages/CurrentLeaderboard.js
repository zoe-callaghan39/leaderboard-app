import { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";

export default function CurrentLeaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://leaderboard-app-v48a.onrender.com/leaderboard/current")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2 style={{ padding: "1rem" }}>Current Leaderboard</h2>
      {data.length === 0 ? (
        <p style={{ padding: "1rem" }}>
          No scores have been added yet this month.
        </p>
      ) : (
        <Leaderboard data={data} title="" />
      )}
    </div>
  );
}
