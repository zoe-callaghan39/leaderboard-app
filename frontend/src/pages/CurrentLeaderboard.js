// src/pages/CurrentLeaderboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";

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

export default function CurrentLeaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // compute current month as e.g. "May"
  const now = new Date();
  const thisMonthName = monthNames[now.getMonth()];

  // unchanged: build a cache-busting key so effect re-runs if month flips
  const currentMonthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    setLoading(true);
    setData([]);

    axios
      .get(`${API_BASE}/leaderboard/current?nocache=${Date.now()}`)
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch current leaderboard:", err);
        setData([]);
        setLoading(false);
      });
  }, [currentMonthKey]);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (data.length === 0) {
    return <p>No scores have been added yet this month.</p>;
  }

  // pass the dynamic title
  return (
    <Leaderboard
      key={currentMonthKey}
      data={data}
      title={`${thisMonthName} Leaderboard`}
    />
  );
}
