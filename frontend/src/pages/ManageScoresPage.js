import React, { useState, useEffect } from "react";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://leaderboard-app-v48a.onrender.com";

export default function ManageScoresPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [points, setPoints] = useState("");
  const [action, setAction] = useState("add");
  const [newUserName, setNewUserName] = useState("");
  const [removeUserName, setRemoveUserName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericPoints = parseInt(points);
    if (!selectedUser || isNaN(numericPoints)) {
      return setMessage("Please select a user and enter valid points.");
    }

    const adjustedPoints = action === "remove" ? -numericPoints : numericPoints;

    const res = await fetch(`${API_BASE}/add-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: selectedUser, points: adjustedPoints }),
    });

    const data = await res.json();
    setMessage(data.message || "Error updating points.");
    setPoints("");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUserName) return setMessage("Please enter a user name.");

    const res = await fetch(`${API_BASE}/add-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName, points: 0 }),
    });

    const data = await res.json();
    setMessage(data.message || "User added.");
    setNewUserName("");
    setUsers((prev) => [...prev, { name: newUserName }]);
  };

  const handleRemoveUser = async (e) => {
    e.preventDefault();

    if (!removeUserName) return setMessage("Select a user to remove.");

    const res = await fetch(`${API_BASE}/users/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: removeUserName }),
    });

    const data = await res.json();
    setMessage(data.message || "User removed.");
    setRemoveUserName("");
    setUsers((prev) => prev.filter((u) => u.name !== removeUserName));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Manage Scores</h2>

      <form onSubmit={handleSubmit}>
        <h4>Add/Remove Points</h4>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u.name} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="add">Add</option>
          <option value="remove">Remove</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      <hr />

      <form onSubmit={handleAddUser}>
        <h4>Add New User</h4>
        <input
          placeholder="New user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>

      <hr />

      <form onSubmit={handleRemoveUser}>
        <h4>Remove User</h4>
        <select
          value={removeUserName}
          onChange={(e) => setRemoveUserName(e.target.value)}
        >
          <option value="">Select user to remove</option>
          {users.map((u) => (
            <option key={u.name} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>
        <button type="submit">Remove</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
