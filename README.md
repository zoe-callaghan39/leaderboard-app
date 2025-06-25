# Leaderboard App  🏆

This Leaderboard App is a full‑stack web application that keeps a running tally of the friendly competitions I host for my team at work (Team Avalanche). Colleagues earn points for daily trivia challenges and other ad‑hoc events, the app updates the standings in real time, and at the turn of each month the current table is archived so you can revisit past glories while a fresh scoreboard starts collecting points. A permanent all‑time ranking sits alongside the monthly view so the true team royalty never goes unrecognised.

The project bundles a React front end with a Node/Express back end talking to a Postgres database. Both layers are deployed to Render, and the live site is always available at https://www.avalanche-leaderboard.com/.

## Technology snapshot

The client is a React 18 single‑page application rendered with React Router. Animations and visual touches (including the animated background on the leaderboard pages) are handled with lightweight CSS and the HTML Canvas API, while screenshots of the podium can be downloaded thanks to html2canvas. The server is an Express 4 API that exposes routes for querying and mutating scores; it relies on the official pg driver to talk to PostgreSQL, and the database itself runs on Render’s managed Postgres service. Environment variables are loaded with dotenv and CORS is enabled so the front end can call the API from a different origin during development.

## Running locally

After cloning the repository install all dependencies with npm install. The root package.json defines scripts for the back‑end only, so to launch the API simply run npm run dev (which fires up nodemon against index.js) or npm start to run the server without hot‑reload. You should see 🚀 Server ready at http://localhost:4000 in your terminal.

The React client lives in the frontend folder. Open a second terminal, cd into frontend, and run npm install && npm start. The development server will launch on http://localhost:3000; its proxy configuration pipes API requests to port 4000 so you can explore the full stack locally without wrestling with CORS.

If you prefer to inspect the database you can connect to the same connection string used by the server (available as DATABASE_URL in your environment). Render’s dashboard also offers a convenient SQL shell and snapshot tools.

## Things left to do
- Unit test coverage: add automated testing to ensure core logic remains stable as the codebase grows.
- Authentication & admin controls: restrict the Manage Scores page so only authorised users can modify points.
- Self‑service branding: expose a configuration panel so anyone can rename teams, tweak colours, and spin up their own leaderboard without touching code.
- Slack integration: send daily standings or celebratory podium posts to a configurable Slack channel.
