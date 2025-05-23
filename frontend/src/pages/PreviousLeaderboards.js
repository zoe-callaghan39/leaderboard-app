import React, { useState, useEffect } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://leaderboard-app-v48a.onrender.com";

const months = [
  { label: "April 25 Leaderboard", value: "2025-04" },
  { label: "March 25 Leaderboard", value: "2025-03" },
  { label: "February 25 Leaderboard", value: "2025-02" },
  { label: "January 25 Leaderboard", value: "2025-01" },
  { label: "December 24 Leaderboard", value: "2024-12" },
];

export default function PreviousLeaderboards() {
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/leaderboard/${selectedMonth}`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Failed to fetch leaderboard", err));
  }, [selectedMonth]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Previous Leaderboards</h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {months.map((m) => (
          <button
            key={m.value}
            onClick={() => setSelectedMonth(m.value)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedMonth === m.value ? "#333" : "#eee",
              color: selectedMonth === m.value ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                {entry.name}
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>
                {entry.total_points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
