import React, { useState, useEffect, useRef } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import styles from "./styles/ManageScoresPage.module.css";

const API_BASE = "https://leaderboard-app-v48a.onrender.com";

export default function ManageScoresPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [points, setPoints] = useState("");
  const [action, setAction] = useState("add");
  const [newUserName, setNewUserName] = useState("");
  const [removeUserName, setRemoveUserName] = useState("");
  const [message, setMessage] = useState("");

  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef();
  const [openRemove, setOpenRemove] = useState(false);
  const removeRef = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  useEffect(() => {
    const onBodyClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
      if (removeRef.current && !removeRef.current.contains(e.target)) {
        setOpenRemove(false);
      }
    };
    document.body.addEventListener("click", onBodyClick);
    return () => document.body.removeEventListener("click", onBodyClick);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseInt(points, 10);
    if (!selectedUser || isNaN(num)) {
      return setMessage("Please select a user and enter valid points.");
    }
    const adjusted = action === "remove" ? -num : num;
    const res = await fetch(`${API_BASE}/add-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: selectedUser, points: adjusted }),
    });
    const data = await res.json();
    setMessage(data.message || "Error updating points.");
    setPoints("");
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName) {
      return setMessage("Please enter a user name.");
    }
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
    if (!removeUserName) {
      return setMessage("Select a user to remove.");
    }
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
    <div className={styles.container}>
      <AnimatedBackground />

      <div className={styles.inner}>
        <h2 className={styles.title}>Manage Scores</h2>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Manage Points</h4>
            <div
              className={`${styles.toggleGroup} ${
                action === "remove" ? styles.removeActive : ""
              }`}
            >
              <span className={styles.pillIndicator} />
              <button
                type="button"
                className={
                  action === "add"
                    ? `${styles.toggleButton} ${styles.toggleActive}`
                    : styles.toggleButton
                }
                onClick={() => setAction("add")}
              >
                Add
              </button>
              <button
                type="button"
                className={
                  action === "remove"
                    ? `${styles.toggleButton} ${styles.toggleActive}`
                    : styles.toggleButton
                }
                onClick={() => setAction("remove")}
              >
                Remove
              </button>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.monthSelector} ref={userRef}>
              <button
                type="button"
                className={
                  openUser
                    ? `${styles.monthToggle} ${styles.monthToggleActive}`
                    : styles.monthToggle
                }
                onClick={() => setOpenUser((o) => !o)}
              >
                {selectedUser || "Select a user"}
                <img
                  src="/assets/chevron.png"
                  alt=""
                  className={
                    openUser
                      ? `${styles.arrowIcon} ${styles.arrowIconOpen}`
                      : styles.arrowIcon
                  }
                />
              </button>
              {openUser && (
                <div className={styles.dropdownList}>
                  {users.map((u) => {
                    const isActive = u.name === selectedUser;
                    return (
                      <div
                        key={u.name}
                        className={
                          isActive
                            ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                            : styles.dropdownItem
                        }
                        onClick={() => {
                          setSelectedUser(u.name);
                          setOpenUser(false);
                        }}
                      >
                        {u.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <input
              className={styles.input}
              type="number"
              placeholder="Points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />

            <button className={styles.submitButton} type="submit">
              Submit
            </button>
          </form>
        </div>

        <hr className={styles.hr} />

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Add New User</h4>
          <form className={styles.form} onSubmit={handleAddUser}>
            <input
              className={styles.input}
              placeholder="New user name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <button className={styles.submitButton} type="submit">
              Add User
            </button>
          </form>
        </div>

        <hr className={styles.hr} />

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Remove User</h4>
          <form className={styles.form} onSubmit={handleRemoveUser}>
            <div className={styles.monthSelector} ref={removeRef}>
              <button
                type="button"
                className={
                  openRemove
                    ? `${styles.monthToggle} ${styles.monthToggleActive}`
                    : styles.monthToggle
                }
                onClick={() => setOpenRemove((o) => !o)}
              >
                {removeUserName || "Select user to remove"}
                <img
                  src="/assets/chevron.png"
                  alt=""
                  className={
                    openRemove
                      ? `${styles.arrowIcon} ${styles.arrowIconOpen}`
                      : styles.arrowIcon
                  }
                />
              </button>
              {openRemove && (
                <div className={styles.dropdownList}>
                  {users.map((u) => {
                    const isActive = u.name === removeUserName;
                    return (
                      <div
                        key={u.name}
                        className={
                          isActive
                            ? `${styles.dropdownItem} ${styles.dropdownItemActive}`
                            : styles.dropdownItem
                        }
                        onClick={() => {
                          setRemoveUserName(u.name);
                          setOpenRemove(false);
                        }}
                      >
                        {u.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <button className={styles.submitButton} type="submit">
              Remove
            </button>
          </form>
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
