const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const PORT = process.env.PORT || 4000;

// CREATE TABLES IF NOT EXISTS
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    removed BOOLEAN DEFAULT FALSE
  );
  CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER,
    date TIMESTAMP,
    month TEXT
  );
`);

// GET: All active users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name FROM users WHERE removed = FALSE ORDER BY name ASC"
    );
    res.json(result.rows.map((row) => ({ name: row.name })));
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST: Soft-remove a user
app.post("/users/remove", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required." });

  try {
    await pool.query("UPDATE users SET removed = TRUE WHERE name = $1", [name]);
    res.json({
      message: `${name} has been removed from upcoming leaderboards.`,
    });
  } catch (err) {
    console.error("Error removing user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST: Add live points
app.post("/add-points", async (req, res) => {
  const { name, points } = req.body;
  if (!name || typeof points !== "number") {
    return res.status(400).json({ error: "Name and numeric points required." });
  }

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  try {
    let result = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    let userId;
    if (result.rows.length === 0) {
      const insertUser = await pool.query(
        "INSERT INTO users(name) VALUES($1) RETURNING id",
        [name]
      );
      userId = insertUser.rows[0].id;
    } else {
      userId = result.rows[0].id;

      if (result.rows[0].removed) {
        await pool.query("UPDATE users SET removed = FALSE WHERE id = $1", [
          userId,
        ]);
      }
    }

    await pool.query(
      "INSERT INTO scores(user_id, points, date, month) VALUES($1, $2, $3, $4)",
      [userId, points, now, month]
    );

    res.json({ message: `Added ${points} points to ${name}` });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST: Add historic points
app.post("/add-historic", async (req, res) => {
  const { name, points, date, month } = req.body;
  if (!name || typeof points !== "number" || !date || !month) {
    return res
      .status(400)
      .json({ error: "Name, points, date, and month are required." });
  }

  try {
    let result = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    let userId;
    if (result.rows.length === 0) {
      const insertUser = await pool.query(
        "INSERT INTO users(name) VALUES($1) RETURNING id",
        [name]
      );
      userId = insertUser.rows[0].id;
    } else {
      userId = result.rows[0].id;

      if (result.rows[0].removed) {
        await pool.query("UPDATE users SET removed = FALSE WHERE id = $1", [
          userId,
        ]);
      }
    }

    await pool.query(
      "INSERT INTO scores(user_id, points, date, month) VALUES($1, $2, $3, $4)",
      [userId, points, new Date(date), month]
    );

    res.json({
      message: `Added historic ${points} points to ${name} for ${month}`,
    });
  } catch (err) {
    console.error("Error adding historic points:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Current month leaderboard
app.get("/leaderboard/current", async (req, res) => {
  const client = await pool.connect();
  try {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    const result = await client.query(
      `
        SELECT users.name, SUM(scores.points) AS total_points
        FROM scores
        JOIN users ON scores.user_id = users.id AND users.removed = FALSE
        WHERE scores.month = $1
        GROUP BY users.name
        ORDER BY total_points DESC;
      `,
      [month]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching current leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// GET: All-time leaderboard (should include all users)
app.get("/leaderboard/all-time", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT users.name, SUM(scores.points) AS total_points
        FROM scores
        JOIN users ON scores.user_id = users.id
        GROUP BY users.name
        ORDER BY total_points DESC;
      `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all-time leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Specific month's leaderboard
app.get("/leaderboard/:month", async (req, res) => {
  const { month } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
        SELECT users.name, SUM(scores.points) AS total_points
        FROM scores
        JOIN users ON scores.user_id = users.id
        WHERE scores.month = $1
        GROUP BY users.name
        ORDER BY total_points DESC;
      `,
      [month]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(`Error fetching leaderboard for ${month}:`, error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
