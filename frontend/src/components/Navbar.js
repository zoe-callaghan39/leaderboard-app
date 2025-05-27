import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className={styles.navbar}>
      <button
        className={styles.burger}
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span />
      </button>
      <div className={`${styles.menu} ${open ? styles.open : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          Current
        </Link>
        <Link to="/all-time" onClick={() => setOpen(false)}>
          All-Time
        </Link>
        <Link to="/previous" onClick={() => setOpen(false)}>
          Previous
        </Link>
        <Link to="/manage-scores" onClick={() => setOpen(false)}>
          Manage
        </Link>
      </div>
    </nav>
  );
}
