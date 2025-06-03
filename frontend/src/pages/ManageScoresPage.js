import React, { useState, useEffect, useRef } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import styles from "./styles/ManageScoresPage.module.css";

const API_BASE = "https://leaderboard-app-v48a.onrender.com";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function ManageScoresPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [points, setPoints] = useState("");
  const [action, setAction] = useState("add");

  const [newUserName, setNewUserName] = useState("");
  const [removeUserName, setRemoveUserName] = useState("");

  const [pointsMessage, setPointsMessage] = useState("");
  const [addMessage, setAddMessage] = useState("");
  const [removeMessage, setRemoveMessage] = useState("");

  const [openUser, setOpenUser] = useState(false);
  const userRef = useRef();
  const [openRemove, setOpenRemove] = useState(false);
  const removeRef = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
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
    setPointsMessage("");

    const num = parseInt(points, 10);
    if (!selectedUser || isNaN(num)) {
      return setPointsMessage("Please select a user and enter valid points.");
    }

    if (action === "remove") {
      try {
        const resp = await fetch(`${API_BASE}/leaderboard/current`);
        if (!resp.ok) throw new Error("Could not fetch current totals");
        const data = await resp.json(); 
        const entry = data.find((row) => row.name === selectedUser);
        const currentPoints = entry ? parseInt(entry.total_points, 10) || 0 : 0;

        if (num > currentPoints) {
          const attemptedLabel = num === 1 ? "point" : "points";
          if (currentPoints === 0) {
            return setPointsMessage(
              `Unable to remove ${num} ${attemptedLabel}, as ${capitalize(
                selectedUser
              )} has 0 points.`
            );
          } else {
            const haveLabel = currentPoints === 1 ? "point" : "points";
            return setPointsMessage(
              `Unable to remove ${num} ${attemptedLabel}, as ${capitalize(
                selectedUser
              )} only has ${currentPoints} ${haveLabel}.`
            );
          }
        }
      } catch (err) {
        console.error(err);
        return setPointsMessage(
          "Error checking user’s current points. Please try again."
        );
      }
    }

    const adjusted = action === "remove" ? -num : num;
    try {
      const res = await fetch(`${API_BASE}/add-points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedUser, points: adjusted }),
      });

      if (res.ok) {
        const verb = num === 1 ? "has" : "have";
        if (action === "add") {
          setPointsMessage(
            `${num} point${
              num !== 1 ? "s" : ""
            } ${verb} been added to ${capitalize(selectedUser)}.`
          );
        } else {
          setPointsMessage(
            `${num} point${
              num !== 1 ? "s" : ""
            } ${verb} been removed from ${capitalize(selectedUser)}.`
          );
        }
        setPoints("");
      } else {
        const data = await res.json();
        setPointsMessage(data.error || "Error updating points.");
      }
    } catch (err) {
      console.error(err);
      setPointsMessage("Network error. Please try again.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddMessage("");
    if (!newUserName) {
      return setAddMessage("Please enter a user name.");
    }
    try {
      const res = await fetch(`${API_BASE}/add-points`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUserName, points: 0 }),
      });
      if (res.ok) {
        setAddMessage(
          `${capitalize(newUserName)} has been added to the leaderboard.`
        );
        setNewUserName("");
        setUsers((prev) => [...prev, { name: newUserName }]);
      } else {
        const data = await res.json();
        setAddMessage(data.error || "User could not be added.");
      }
    } catch (err) {
      console.error(err);
      setAddMessage("Network error. Please try again.");
    }
  };

  const handleRemoveUser = async (e) => {
    e.preventDefault();
    setRemoveMessage("");
    if (!removeUserName) {
      return setRemoveMessage("Select a user to remove.");
    }
    try {
      const res = await fetch(`${API_BASE}/users/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: removeUserName }),
      });
      if (res.ok) {
        setRemoveMessage(
          `${capitalize(
            removeUserName
          )} has been removed from the upcoming leaderboards.`
        );
        setRemoveUserName("");
        setUsers((prev) => prev.filter((u) => u.name !== removeUserName));
      } else {
        const data = await res.json();
        setRemoveMessage(data.error || "User could not be removed.");
      }
    } catch (err) {
      console.error(err);
      setRemoveMessage("Network error. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <AnimatedBackground />

      <div className={styles.inner}>
        <h2 className={styles.title}>Manage Scores</h2>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Manage Points</h4>
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
                {selectedUser ? capitalize(selectedUser) : "Select a user"}
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
                        {capitalize(u.name)}
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

            <div className={styles.toggleGroupContainer}>
              <div
                className={`
                  ${styles.toggleGroup}
                  ${action === "remove" ? styles.removeActive : ""}
                `}
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

            <button className={styles.submitButton} type="submit">
              Submit
            </button>
          </form>

          {pointsMessage && <p className={styles.message}>{pointsMessage}</p>}
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

          {addMessage && <p className={styles.message}>{addMessage}</p>}
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
                {removeUserName
                  ? capitalize(removeUserName)
                  : "Select user to remove"}
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
                        {capitalize(u.name)}
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

          {removeMessage && <p className={styles.message}>{removeMessage}</p>}
        </div>
      </div>
    </div>
  );
}
