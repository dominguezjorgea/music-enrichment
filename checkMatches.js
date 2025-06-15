const fs = require("fs");

const eventsPath = "./static/data/streamingEvents.csv";
const songsPath = "./static/data/songs.json";

const events = fs
  .readFileSync(eventsPath, "utf-8")
  .split("\n")
  .slice(1)
  .filter(Boolean)
  .map((line) => line.split(",")[1]);

const songs = JSON.parse(fs.readFileSync(songsPath, "utf-8")).songs.map(
  (s) => s.songId
);

const matched = events.filter((id) => songs.includes(id));

console.log(`✅ Matched IDs: ${matched.length}`);
console.log(`🔍 First matched IDs:`, matched.slice(0, 5));
