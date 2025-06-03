import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedBackground from "../components/AnimatedBackground";
import styles from "./styles/SquadRoyalty.module.css";

const API_BASE = "https://leaderboard-app-v48a.onrender.com";

export default function SquadRoyalty() {
  const [podiumMap, setPodiumMap] = useState({ 1: [], 2: [], 3: [] });
  const [loading, setLoading] = useState(true);
  const [monthLabel, setMonthLabel] = useState("");

  function getLastMonthKeyAndLabel() {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    d.setDate(d.getDate() - 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const label = d.toLocaleString("default", { month: "long" });
    return { key: `${yyyy}-${mm}`, label };
  }

  useEffect(() => {
    const { key, label } = getLastMonthKeyAndLabel();
    setMonthLabel(label);

    setLoading(true);
    setPodiumMap({ 1: [], 2: [], 3: [] });

    axios
      .get(`${API_BASE}/leaderboard/${key}?nocache=${Date.now()}`)
      .then((res) => {
        const data = res.data || [];
        if (!Array.isArray(data)) {
          console.error("Unexpected response for /leaderboard/{month}:", data);
          setLoading(false);
          return;
        }

        const filtered = data.filter((u) => Number(u.total_points) > 0);

        const groupsByPoints = filtered.reduce((acc, u) => {
          const pts = Number(u.total_points);
          acc[pts] = acc[pts] || [];
          acc[pts].push({ ...u, total_points: pts });
          return acc;
        }, {});

        const sortedKeys = Object.keys(groupsByPoints)
          .map(Number)
          .sort((a, b) => b - a);
        const groups = sortedKeys.map((pts) => groupsByPoints[pts]);

        const newPodium = { 1: [], 2: [], 3: [] };
        const queue = [...groups];
        let slot = 1;
        while (slot <= 3 && queue.length) {
          const grp = queue.shift();
          if (grp.length <= 2) {
            newPodium[slot] = grp;
          } else {
            newPodium[slot] = grp.slice(0, 2);
            queue.unshift(grp.slice(2));
          }
          slot++;
        }

        for (let s = 1; s <= 3; s++) {
          newPodium[s].forEach((u) => (u.rank = s));
        }

        setPodiumMap(newPodium);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch last-month leaderboard:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    Object.entries(podiumMap).forEach(([position, users]) =>
      users.forEach((u) => {
        const lower = u.name.toLowerCase();
        const imgFolder = Number(position) === 1 ? "/winners" : "/avatars";
        const img = new Image();
        img.src = `${imgFolder}/${lower}.png`;
      })
    );
  }, [podiumMap]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const podium3 = document.getElementById("podium-third");
        const podium2 = document.getElementById("podium-second");
        const podium1 = document.getElementById("podium-first");
        if (podium3) {
          podium3.style.transform = "translateY(0)";
          podium3.style.opacity = "1";
        }
        if (podium2) {
          podium2.style.transform = "translateY(0)";
          podium2.style.opacity = "1";
        }
        if (podium1) {
          podium1.style.transform = "translateY(0)";
          podium1.style.opacity = "1";
        }

        const seq = [
          { id: "second", delay: 500 },
          { id: "first", delay: 800 },
          { id: "third", delay: 1100 },
        ];
        seq.forEach(({ id, delay }) => {
          setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
              el.style.transform = "translateY(0)";
              el.style.opacity = "1";
            }
          }, delay);
        });
      }, 200);
    }
  }, [loading, podiumMap]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <AnimatedBackground />
      </div>
    );
  }

  const getMedalColor = (pos) => {
    if (pos === 1) return "#F5C518";
    if (pos === 2) return "#C0C0C0";
    return "rgba(205,127,50,1)";
  };

  return (
    <div className={styles.pageWrapper}>
      <AnimatedBackground />

      {Array.from({ length: 100 }).map((_, i) => {
        const colors = [
          "#FFD700",
          "#C0C0C0",
          "#CD7F32",
          "#FF5252",
          "#4CAF50",
          "#2196F3",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = Math.random() * 3 + 2;
        return (
          <div
            key={`confetti-${i}`}
            className={styles.confetti}
            style={{
              backgroundColor: color,
              left: `${left}vw`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}

      <div className={styles.content}>
        <h2 className={`${styles.title} ${styles.titleAnimation}`}>
          Squad Royalty
        </h2>
        <h3 className={styles.subtitle}>Last Month’s Winners ({monthLabel})</h3>

        <div className={styles.podiumContainer}>
          <div className={styles.podiumBlock3} id="podium-third">
            <div className={styles.mobileContent}>
              {podiumMap[3] && podiumMap[3][0] && (
                <>
                  <div
                    className={styles.medalCircle}
                    style={{ backgroundColor: getMedalColor(3) }}
                  >
                    <span className={styles.medalNumber}>3</span>
                  </div>
                  <div className={styles.mobilePoints}>
                    {podiumMap[3][0].total_points} points
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.podiumBlock2} id="podium-second">
            <div className={styles.mobileContent}>
              {podiumMap[2] && podiumMap[2][0] && (
                <>
                  <div
                    className={styles.medalCircle}
                    style={{ backgroundColor: getMedalColor(2) }}
                  >
                    <span className={styles.medalNumber}>2</span>
                  </div>
                  <div className={styles.mobilePoints}>
                    {podiumMap[2][0].total_points} points
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.podiumBlock1} id="podium-first">
            <div className={styles.mobileContent}>
              {podiumMap[1] && podiumMap[1][0] && (
                <>
                  <div
                    className={styles.medalCircle}
                    style={{ backgroundColor: getMedalColor(1) }}
                  >
                    <span className={styles.medalNumber}>1</span>
                  </div>
                  <div className={styles.mobilePoints}>
                    {podiumMap[1][0].total_points} points
                  </div>
                </>
              )}
            </div>
          </div>

          {[2, 1, 3].map((pos) => {
            const group = podiumMap[pos];
            if (!group || group.length === 0) return null;

            const duo = group.length > 1;
            const avatarFolder = pos === 1 ? "/winners" : "/avatars";
            const cardId = pos === 1 ? "first" : pos === 2 ? "second" : "third";
            const medalText =
              pos === 1
                ? "Gold Medalist"
                : pos === 2
                ? "Silver Medalist"
                : "Bronze Medalist";

            return (
              <div
                key={`winner-pos-${pos}`}
                className={`${styles.winnerCard} ${styles[`pos${pos}`]}`}
                id={cardId}
              >
                <div className={styles.avatarWrapper}>
                  {group.map((u) => {
                    const lower = u.name.toLowerCase();
                    const src = `${avatarFolder}/${lower}.png`;
                    return (
                      <img
                        key={`${pos}-${u.name}`}
                        src={src}
                        alt={u.name}
                        className={
                          duo ? styles.smallAvatar : styles.singleAvatar
                        }
                        onError={(e) =>
                          (e.currentTarget.style.visibility = "hidden")
                        }
                      />
                    );
                  })}
                </div>

                <div className={styles.mobileInfo}>
                  <div className={styles.plaqueName}>
                    {group.map((u) => u.name).join(" & ")}
                  </div>
                  <div className={styles.plaqueRole}>{medalText}</div>
                </div>

                <div className={styles.plaque}>
                  <div
                    className={styles.medalCircle}
                    style={{ backgroundColor: getMedalColor(pos) }}
                  >
                    <span className={styles.medalNumber}>{pos}</span>
                  </div>
                  <div className={styles.plaqueText}>
                    <div className={styles.plaqueName}>
                      {group.map((u) => u.name).join(" & ")}
                    </div>
                    <div className={styles.plaqueRole}>{medalText}</div>
                    <div className={styles.plaquePoints}>
                      {group[0].total_points} points
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
