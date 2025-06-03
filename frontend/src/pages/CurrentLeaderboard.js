import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";
import EmptyLeaderboard from "../components/EmptyLeaderboard";
import css from "./styles/CurrentLeaderboard.module.css";

const API_BASE = "https://leaderboard-app-v48a.onrender.com";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getPointsFromUser(user) {
  if (user.total_points != null) {
    return Number(user.total_points) || 0;
  }
  if (user.points != null) {
    return Number(user.points) || 0;
  }
  if (user.score != null) {
    return Number(user.score) || 0;
  }
  return 0;
}

export default function CurrentLeaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const thisMonthName = monthNames[now.getMonth()];

  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    setData([]);

    axios
      .get(`${API_BASE}/leaderboard/current?nocache=${Date.now()}`)
      .then((res) => {
        const fetched = res.data || [];
        console.log("[CurrentLeaderboard] fetched data:", fetched);
        setData(fetched);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch current leaderboard:", err);
        setData([]);
        setLoading(false);
      });
  }, [currentMonthKey]);

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

  const hasAnyPoints = data.some((user) => getPointsFromUser(user) >= 1);

  if (!hasAnyPoints) {
    return <EmptyLeaderboard monthName={thisMonthName} />;
  }

  return (
    <div className={css.pageContainer}>
      <h2 className={css.title}>
        {thisMonthName}
        {"\n"}Leaderboard
      </h2>
      <Leaderboard key={currentMonthKey} data={data} title={null} />
    </div>
  );
}
