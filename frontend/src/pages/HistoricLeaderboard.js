import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Leaderboard from "../components/Leaderboard";

export default function HistoricLeaderboard() {
  const [data, setData] = useState([]);
  const { month } = useParams();

  useEffect(() => {
    axios
      .get(`https://leaderboard-app-v48a.onrender.com/leaderboard/${month}`)
      .then((res) => setData(res.data));
  }, [month]);

  return <Leaderboard data={data} title={`Leaderboard for ${month}`} />;
}
