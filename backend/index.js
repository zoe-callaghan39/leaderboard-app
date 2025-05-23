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
    name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER,
    date TIMESTAMP,
    month TEXT
  );
`);

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
          JOIN users ON scores.user_id = users.id
          WHERE scores.month = $1
          GROUP BY users.name
          ORDER BY total_points DESC;
        `,
      [month]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
