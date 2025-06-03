import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/PreviousLeaderboard.module.css";
import AnimatedBackground from "../components/AnimatedBackground";
import Leaderboard from "../components/Leaderboard";

const API_BASE = "https://leaderboard-app-v48a.onrender.com";

const getMonthLabel = (value) => {
  const [year] = value.split("-");
  const date = new Date(`${value}-01`);
  const monthName = date.toLocaleString("default", { month: "long" });
  return `${monthName} ${year}`;
};

export default function PreviousLeaderboards() {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/all-months?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date();
        const current = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}`;
        const past = data
          .filter((m) => m < current)
          .sort()
          .reverse();
        setMonths(past);
        if (past.length) setSelectedMonth(past[0]);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;
    fetch(`${API_BASE}/leaderboard/${selectedMonth}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then(setLeaderboard)
      .catch(console.error);
  }, [selectedMonth]);

  useEffect(() => {
    if (!leaderboard || leaderboard.length === 0) return;

    leaderboard.forEach((user) => {
      const lower = user.name.toLowerCase();

      const img = new Image();
      img.src = `/avatars/${lower}.png`;

      const crownImg = new Image();
      crownImg.src = `/crown-avatars/${lower}-crown.png`;
    });
  }, [leaderboard]);

  useEffect(() => {
    const onBodyClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.body.addEventListener("click", onBodyClick);
    return () => document.body.removeEventListener("click", onBodyClick);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AnimatedBackground />

      <div className={styles.container}>
        <h2 className={styles.title}>Previous Leaderboards</h2>

        <div className={styles.monthSelector} ref={ref}>
          {selectedMonth && (
            <button
              className={
                open
                  ? `${styles.monthToggle} ${styles.monthToggleActive}`
                  : styles.monthToggle
              }
              onClick={() => setOpen((o) => !o)}
            >
              {getMonthLabel(selectedMonth)}
              <img
                src="/assets/chevron.png"
                alt=""
                className={
                  open
                    ? `${styles.arrowIcon} ${styles.arrowIconOpen}`
                    : styles.arrowIcon
                }
              />
            </button>
          )}

          {open && (
            <div className={styles.dropdownList}>
              {months.map((m) => {
                const isActive = m === selectedMonth;
                return (
                  <div
                    key={m}
                    className={
                      isActive
                        ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                        : styles.dropdownItem
                    }
                    onClick={() => {
                      setSelectedMonth(m);
                      setOpen(false);
                    }}
                  >
                    {getMonthLabel(m)}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedMonth && (
          <Leaderboard key={selectedMonth} data={leaderboard} title={null} />
        )}
      </div>
    </div>
  );
}
