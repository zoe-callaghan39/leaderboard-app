const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/**
 * POST /add-points
 * Body: { name: "Zoe", points: 5 }
 */
app.post("/add-points", async (req, res) => {
  const { name, points } = req.body;

  if (!name || typeof points !== "number") {
    return res
      .status(400)
      .json({ error: "Invalid request. Provide name and numeric points." });
  }

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  try {
    let user = await prisma.user.findFirst({ where: { name } });

    if (!user) {
      user = await prisma.user.create({ data: { name } });
    }

    await prisma.score.create({
      data: {
        userId: user.id,
        points,
        date: now,
        month,
      },
    });

    res.json({ message: `Added ${points} points to ${name}` });
  } catch (error) {
    console.error("Error adding points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /leaderboard/current
 * Returns current month leaderboard
 */
app.get("/leaderboard/current", async (req, res) => {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  try {
    const scores = await prisma.score.groupBy({
      by: ["userId"],
      where: { month },
      _sum: { points: true },
    });

    const users = await prisma.user.findMany();

    const result = scores
      .map((s) => ({
        name: users.find((u) => u.id === s.userId)?.name || "Unknown",
        points: s._sum.points || 0,
      }))
      .sort((a, b) => b.points - a.points);

    res.json(result);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/migrate", async (req, res) => {
  try {
    const { execSync } = require("child_process");
    const output = execSync("npx prisma migrate deploy").toString();
    res.status(200).send(`<pre>${output}</pre>`);
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
