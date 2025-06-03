import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./styles/Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((o) => !o);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const iconNames = ["current", "previous", "all-time", "royal", "manage"];
    iconNames.forEach((name) => {
      const img = new Image();
      img.src = `/icons/${name}.png`;
    });
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${open ? styles.open : ""}`}
      aria-label="Main navigation"
    >
      <button
        className={styles.burger}
        onClick={toggleMenu}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-controls="mobile-menu"
        aria-expanded={open}
      >
        <span />
      </button>

      <div
        id="mobile-menu"
        className={`${styles.menu} ${open ? styles.open : ""}`}
        role="menu"
        aria-hidden={!open}
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            [styles.link, isActive && styles.active].filter(Boolean).join(" ")
          }
          onClick={handleClose}
        >
          <img src="/icons/current.png" alt="" className={styles.icon} />
          Current
        </NavLink>

        <NavLink
          to="/previous"
          className={({ isActive }) =>
            [styles.link, isActive && styles.active].filter(Boolean).join(" ")
          }
          onClick={handleClose}
        >
          <img src="/icons/previous.png" alt="" className={styles.icon} />
          Previous
        </NavLink>

        <NavLink
          to="/all-time"
          className={({ isActive }) =>
            [styles.link, isActive && styles.active].filter(Boolean).join(" ")
          }
          onClick={handleClose}
        >
          <img src="/icons/all-time.png" alt="" className={styles.icon} />
          All Time
        </NavLink>

        <NavLink
          to="/squad-royalty"
          className={({ isActive }) =>
            [styles.link, isActive && styles.active].filter(Boolean).join(" ")
          }
          onClick={handleClose}
        >
          <img
            src="/icons/royal.png"
            alt=""
            className={`${styles.icon} ${styles.royalIcon}`}
          />
          Squad Royalty
        </NavLink>

        <NavLink
          to="/manage-scores"
          className={({ isActive }) =>
            [styles.link, isActive && styles.active].filter(Boolean).join(" ")
          }
          onClick={handleClose}
        >
          <img src="/icons/manage.png" alt="" className={styles.icon} />
          Manage
        </NavLink>
      </div>
    </nav>
  );
}
