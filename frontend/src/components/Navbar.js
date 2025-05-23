import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Current Leaderboard
      </Link>
      <Link to="/all-time" style={{ marginRight: "1rem" }}>
        All-Time Leaderboard
      </Link>
      <Link
        to="/previous"
        activeclassname="active"
        style={{ marginRight: "1rem" }}
      >
        Previous Leaderboards
      </Link>
      <Link to="/manage-scores">Manage Scores</Link>
    </nav>
  );
}

export default Navbar;
