import React, { useState, useEffect } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import styles from "./styles/EmptyLeaderboard.module.css";

export default function EmptyLeaderboard({ monthName }) {
  const [heartData, setHeartData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const allImages = [
        ...Array.from(
          { length: 13 },
          (_, i) => `/images/hearts/brokenheart${i + 1}.png`
        ),
        ...Array.from(
          { length: 9 },
          (_, i) => `/images/hearts/brokenheart${i + 1}.gif`
        ),
        ...Array.from(
          { length: 23 },
          (_, i) => `/images/hearts/brokenheart-small${i + 1}.png`
        ),
      ];

      const EXCL_X_MIN = 20;
      const EXCL_X_MAX = 80;
      const EXCL_Y_MIN = 10;
      const EXCL_Y_MAX = 30;

      function rectsOverlap(r1, r2) {
        return !(
          r1.right < r2.left ||
          r1.left > r2.right ||
          r1.bottom < r2.top ||
          r1.top > r2.bottom
        );
      }

      const NUM_HEARTS = 130;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const placedHearts = [];

      for (let i = 0; i < NUM_HEARTS; i++) {
        const src = allImages[i % allImages.length];

        let sizeVW;
        if (src.endsWith(".gif")) {
          sizeVW = 60;
        } else if (src.includes("brokenheart-small")) {
          sizeVW = 30;
        } else {
          sizeVW = 50;
        }

        const sizePx = (sizeVW / 100) * vw;
        const MARGIN_PX = 3;

        let leftPct = 0;
        let topPct = 0;
        let tries = 0;

        while (true) {
          tries++;
          leftPct = Math.random() * 100;
          topPct = Math.random() * 100;

          if (
            leftPct >= EXCL_X_MIN &&
            leftPct <= EXCL_X_MAX &&
            topPct >= EXCL_Y_MIN &&
            topPct <= EXCL_Y_MAX
          ) {
            continue;
          }

          const centerX = (leftPct / 100) * vw;
          const centerY = (topPct / 100) * vh;
          const thisRect = {
            left: centerX - sizePx / 2 - MARGIN_PX,
            right: centerX + sizePx / 2 + MARGIN_PX,
            top: centerY - sizePx / 2 - MARGIN_PX,
            bottom: centerY + sizePx / 2 + MARGIN_PX,
          };

          let conflict = false;
          for (const placed of placedHearts) {
            const otherSizePx = (placed.sizeVW / 100) * vw;
            const otherCenterX = (placed.leftPercent / 100) * vw;
            const otherCenterY = (placed.topPercent / 100) * vh;
            const otherRect = {
              left: otherCenterX - otherSizePx / 2 - MARGIN_PX,
              right: otherCenterX + otherSizePx / 2 + MARGIN_PX,
              top: otherCenterY - otherSizePx / 2 - MARGIN_PX,
              bottom: otherCenterY + otherSizePx / 2 + MARGIN_PX,
            };
            if (rectsOverlap(thisRect, otherRect)) {
              conflict = true;
              break;
            }
          }

          if (!conflict || tries > 2000) {
            break;
          }
        }

        const appearDelay = 2 + Math.random() * 15;
        const flickerDuration = Math.random() * 15 + 15;
        const flickerDelay = Math.random() * 15;
        const driftAmplitude = Math.random() * 5 + 5;
        const driftDuration = Math.random() * 15 + 15;
        const driftDelay = Math.random() * 5;

        placedHearts.push({
          src,
          leftPercent: leftPct,
          topPercent: topPct,
          sizeVW,
          appearDelay,
          flickerDuration,
          flickerDelay,
          driftAmplitude,
          driftDuration,
          driftDelay,
        });
      }

      setHeartData(placedHearts);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.wrapper}>
      <AnimatedBackground />

      {heartData.map(
        (
          {
            src,
            leftPercent,
            topPercent,
            sizeVW,
            appearDelay,
            flickerDuration,
            flickerDelay,
            driftAmplitude,
            driftDuration,
            driftDelay,
          },
          idx
        ) => {
          return (
            <img
              key={idx}
              src={src}
              className={styles.heart}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${sizeVW}vw`,

                "--appear-delay": `${appearDelay}s`,
                "--flicker-dur": `${flickerDuration}s`,
                "--flicker-delay": `${flickerDelay}s`,
                "--drift-amt": `${driftAmplitude}px`,
                "--drift-dur": `${driftDuration}s`,
                "--drift-delay": `${driftDelay}s`,
              }}
              alt="broken heart"
            />
          );
        }
      )}

      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>{monthName} Leaderboard</h2>
          <p className={styles.message}>
            No points have been entered for this month yet...
          </p>
        </div>
      </div>
    </div>
  );
}
