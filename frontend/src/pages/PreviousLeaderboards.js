import { useState, useEffect } from "react";

const API_BASE = "https://leaderboard-app-v48a.onrender.com";

const getMonthLabel = (value) => {
  const [year] = value.split("-");
  const date = new Date(`${value}-01`);
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${year.slice(2)} Leaderboard`;
};

export default function PreviousLeaderboards() {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/all-months?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;

        const filtered = data
          .filter((m) => m < currentMonth)
          .sort()
          .reverse();

        setMonths(filtered);
        if (filtered.length > 0) {
          setSelectedMonth(filtered[0]);
        }
      })
      .catch((err) => console.error("Failed to fetch months:", err));
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;

    fetch(`${API_BASE}/leaderboard/${selectedMonth}?nocache=${Date.now()}`) // avoid stale responses
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
            key={m}
            onClick={() => setSelectedMonth(m)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: selectedMonth === m ? "#333" : "#eee",
              color: selectedMonth === m ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {getMonthLabel(m)}
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
