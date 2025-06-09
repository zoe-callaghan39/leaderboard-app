import React from "react";
import styles from "./styles/Leaderboard.module.css";
import AnimatedBackground from "./AnimatedBackground";

function getPointsFromUser(user) {
  if (user.total_points != null) return Number(user.total_points) || 0;
  if (user.points != null) return Number(user.points) || 0;
  if (user.score != null) return Number(user.score) || 0;
  return 0;
}

export default function Leaderboard({ data, title }) {
  const normalized = data.map((u) => ({
    ...u,
    total_points: getPointsFromUser(u),
  }));
  const filteredData = normalized.filter((u) => u.total_points > 0);

  const groupsByPoints = filteredData.reduce((acc, u) => {
    acc[u.total_points] = acc[u.total_points] || [];
    acc[u.total_points].push(u);
    return acc;
  }, {});

  const sortedPointValues = Object.keys(groupsByPoints)
    .map(Number)
    .sort((a, b) => b - a);
  const pointGroups = sortedPointValues.map((pts) => groupsByPoints[pts]);

  const podiumMap = { 1: [], 2: [], 3: [] };
  const queue = [...pointGroups];
  let slot = 1;
  while (slot <= 3 && queue.length) {
    const grp = queue.shift();
    if (grp.length <= 2) {
      podiumMap[slot] = grp;
    } else {
      podiumMap[slot] = grp.slice(0, 2);
      queue.unshift(grp.slice(2));
    }
    slot++;
  }

  let rest = [];
  while (queue.length) {
    rest.push(...queue.shift());
  }

  for (let s = 1; s <= 3; s++) {
    podiumMap[s].forEach((u) => (u.rank = s));
  }
  rest.sort((a, b) => b.total_points - a.total_points);
  let currentRank = slot,
    prevPts = null,
    sameCount = 0;
  rest = rest.map((u, i) => {
    if (i === 0) {
      u.rank = currentRank;
      prevPts = u.total_points;
      sameCount = 1;
    } else if (u.total_points === prevPts) {
      u.rank = currentRank;
      sameCount++;
    } else {
      currentRank += sameCount;
      u.rank = currentRank;
      prevPts = u.total_points;
      sameCount = 1;
    }
    return u;
  });

  const avatarFor = (name) => `/avatars/${name.toLowerCase()}.png`;
  const crownAvatarFor = (name) =>
    `/crown-avatars/${name.toLowerCase()}-crown.png`;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AnimatedBackground />
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}

        <div className={styles.topThree}>
          <div className={styles.podiumBlock2} />
          <div className={styles.podiumBlock1} />
          <div className={styles.podiumBlock3} />

          {[1, 2, 3].map((s) => {
            const group = podiumMap[s];
            if (!group.length) return null;
            const duo = group.length > 1;
            const points = group[0].total_points;

            return (
              <React.Fragment key={s}>
                <div
                  className={[
                    styles.topUser,
                    styles[`pos${s}`],
                    duo && styles.duo,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div className={styles.avatarWrapper}>
                    {group.map((u) => (
                      <img
                        key={u.name}
                        src={
                          s === 1 ? crownAvatarFor(u.name) : avatarFor(u.name)
                        }
                        alt={u.name}
                        className={
                          group.length > 1 ? styles.smallAvatar : undefined
                        }
                        onError={(e) =>
                          (e.currentTarget.style.visibility = "hidden")
                        }
                      />
                    ))}
                  </div>
                  <div className={styles.name}>
                    {group.map((u) => u.name).join(" & ")}
                  </div>
                </div>

                <div className={`${styles.pointsOverlay} ${styles[`pos${s}`]}`}>
                  {points} pts
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <ol className={styles.list}>
          {rest.map((u) => (
            <li
              key={`${u.name}-${u.rank}`}
              className={`${styles.listItem} ${
                u.isCurrentUser ? styles.current : ""
              }`}
            >
              <span className={styles.rank}>{u.rank}</span>
              <img
                src={avatarFor(u.name)}
                alt={u.name}
                className={styles.listAvatar}
                onError={(e) => (e.currentTarget.style.visibility = "hidden")}
              />
              <span className={styles.listName}>{u.name}</span>
              <span className={styles.points}>{u.total_points} pts</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
