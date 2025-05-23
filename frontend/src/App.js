import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CurrentLeaderboard from "./pages/CurrentLeaderboard";
import AllTimeLeaderboard from "./pages/AllTimeLeaderboard";
import HistoricLeaderboard from "./pages/HistoricLeaderboard";
import ManageScoresPage from "./pages/ManageScoresPage"; // import your new page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CurrentLeaderboard />} />
        <Route path="/all-time" element={<AllTimeLeaderboard />} />
        <Route path="/historic/:month" element={<HistoricLeaderboard />} />
        <Route path="/manage-scores" element={<ManageScoresPage />} />
      </Routes>
    </Router>
  );
}

export default App;
