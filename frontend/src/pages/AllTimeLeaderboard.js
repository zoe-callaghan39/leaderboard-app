import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";
import css from "./styles/AllTimeLeaderboard.module.css";

export default function AllTimeLeaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://leaderboard-app-v48a.onrender.com/leaderboard/all-time")
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("❌ Failed to fetch all-time leaderboard:", err)
      );
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    data.forEach((user) => {
      const lower = user.name.toLowerCase();

      const img = new Image();
      img.src = `/avatars/${lower}.png`;

      const crownImg = new Image();
      crownImg.src = `/crown-avatars/${lower}-crown.png`;
    });
  }, [data]);

  return (
    <div>
      <h2 className={css.title}>All Time{"\n"}Leaderboard</h2>
      <Leaderboard data={data} title={null} />
    </div>
  );
}
