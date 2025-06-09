const puppeteer = require("puppeteer");
const axios = require("axios");

const API_BASE = "https://leaderboard-app-v48a.onrender.com";
const API_ENDPOINT = `${API_BASE}/leaderboard/current`;

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const EXTRA_OFFSET = 5;

(async () => {
  const { data: leaderboardData } = await axios.get(
    `${API_ENDPOINT}?nocache=${Date.now()}`
  );

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().startsWith(API_ENDPOINT)) {
      req.respond({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(leaderboardData),
      });
    } else {
      req.continue();
    }
  });

  await page.setViewport({ width: CARD_WIDTH, height: CARD_HEIGHT + 200 });

  await page.goto(
    "https://leaderboard-frontend-b3ki.onrender.com/?nocache=" + Date.now(),
    { waitUntil: "networkidle0" }
  );

  await page.waitForSelector("#social-preview", {
    visible: true,
    timeout: 60_000,
  });

  const navHeight = await page.evaluate(() => {
    const nav =
      document.querySelector("nav") || document.querySelector("header");
    return nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
  });

  const FULL_HEIGHT = navHeight + EXTRA_OFFSET + CARD_HEIGHT;
  await page.setViewport({ width: CARD_WIDTH, height: FULL_HEIGHT });

  await new Promise((r) => setTimeout(r, 500));

  await page.evaluate(() => {
    const btn = document.getElementById("screenshot-button");
    if (btn) btn.style.display = "none";
  });

  await page.screenshot({
    path: "public/social-preview.png",
    type: "png",
    clip: {
      x: 0,
      y: navHeight + EXTRA_OFFSET,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    },
  });

  await browser.close();
  console.log("✅ social-preview.png updated");
})();
