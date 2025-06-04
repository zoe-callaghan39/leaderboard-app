import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import Leaderboard from "../components/Leaderboard";
import css from "./styles/AllTimeLeaderboard.module.css";

export default function AllTimeLeaderboard() {
  const [data, setData] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const pageRef = useRef(null);

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

  const handleScreenshot = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    const docEl = document.documentElement;
    const fullWidth = docEl.scrollWidth;
    const fullHeight = docEl.scrollHeight;

    const containerEl = pageRef.current;
    const cropHeight = containerEl ? containerEl.scrollHeight : fullHeight;

    html2canvas(docEl, {
      useCORS: true,
      logging: false,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
      scrollX: 0,
      scrollY: 0,
      width: fullWidth,
      height: cropHeight,
      ignoreElements: (el) => el.tagName?.toLowerCase() === "noscript",
    })
      .then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "leaderboard_screenshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error("⚠️ Failed to generate screenshot:", err);
      });
  };

  return (
    <>
      <div ref={pageRef} className={css.pageContainer}>
        <h2 className={css.title}>All Time{"\n"}Leaderboard</h2>
        <Leaderboard data={data} title={null} />
      </div>

      <button
        className={`${css.screenshotButton} ${
          isClicked ? css.clicked : ""
        }`.trim()}
        onClick={handleScreenshot}
        title="Download full‐page screenshot"
      >
        <img
          src="/icons/screenshot.png"
          alt="Screenshot"
          className={css.screenshotIcon}
        />
      </button>
    </>
  );
}
