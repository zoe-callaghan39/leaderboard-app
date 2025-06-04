import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CurrentLeaderboard from "./pages/CurrentLeaderboard";
import AllTimeLeaderboard from "./pages/AllTimeLeaderboard";
import PreviousLeaderboards from "./pages/PreviousLeaderboards";
import ManageScoresPage from "./pages/ManageScoresPage";
import SquadRoyalty from "./pages/SquadRoyalty";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CurrentLeaderboard />} />
        <Route path="/all-time" element={<AllTimeLeaderboard />} />
        <Route path="/previous" element={<PreviousLeaderboards />} />
        <Route path="/manage-scores" element={<ManageScoresPage />} />
        <Route path="/squad-royalty" element={<SquadRoyalty />} />
      </Routes>
    </Router>
  );
}

export default App;
