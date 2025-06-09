const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(
    "https://leaderboard-frontend-b3ki.onrender.com/?nocache=" + Date.now(),
    { waitUntil: "networkidle2" }
  );

  await page.waitForSelector("#social-preview", {
    visible: true,
    timeout: 60000,
  });

  await page.waitForTimeout(1000);

  const el = await page.$("#social-preview");
  await el.screenshot({
    path: "public/social-preview.png",
    type: "png",
  });

  await browser.close();
  console.log("✅ social-preview.png updated");
})();
