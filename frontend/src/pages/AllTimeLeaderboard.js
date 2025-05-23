import { useEffect, useState } from "react";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";

export default function AllTimeLeaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://leaderboard-app-v48a.onrender.com/leaderboard/all-time")
      .then((res) => setData(res.data));
  }, []);

  return <Leaderboard data={data} title="All-Time Leaderboard" />;
}
