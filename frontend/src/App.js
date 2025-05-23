import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CurrentLeaderboard from "./pages/CurrentLeaderboard";
import AllTimeLeaderboard from "./pages/AllTimeLeaderboard";
import HistoricLeaderboard from "./pages/HistoricLeaderboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CurrentLeaderboard />} />
        <Route path="/all-time" element={<AllTimeLeaderboard />} />
        <Route path="/historic/:month" element={<HistoricLeaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
