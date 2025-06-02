import { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";
import css from "./styles/AllTimeLeaderboard.module.css";

export default function AllTimeLeaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://leaderboard-app-v48a.onrender.com/leaderboard/all-time")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2 className={css.title}>All Time{"\n"}Leaderboard</h2>
      <Leaderboard data={data} title={null} />
    </div>
  );
}
