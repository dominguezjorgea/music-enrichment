import * as fs from "fs";
import * as path from "path";

// Read y parse output.json
const outputPath = path.join(__dirname, "../static/data/output.json");
const enrichedData = JSON.parse(fs.readFileSync(outputPath, "utf8"));

// Get arguments from command line
const [command, ...args] = process.argv.slice(2);

// Helper function to check if a timestamp is within a given range
function isWithinRange(timestamp: string, start: string, end: string): boolean {
  return timestamp >= start && timestamp <= end;
}

switch (command) {
  case "top-songs": {
    const [start, end, nRaw] = args;
    const N = parseInt(nRaw);
    const counts: Record<string, number> = {};

    for (const event of enrichedData) {
      if (isWithinRange(event.timestamp, start, end)) {
        counts[event.songId] = (counts[event.songId] || 0) + 1;
      }
    }

    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, N);

    console.log(`Top ${N} Songs from ${start} to ${end}`);
    for (const [songId, count] of top) {
      console.log(`${songId}: ${count} plays`);
    }

    break;
  }

    case "timeline": {
    const [userId, mRaw] = args;
    const M = parseInt(mRaw);

    // Agrupar eventos del usuario por mes
    const now = new Date();
    const userEvents = enrichedData.filter((e: any) => e.userId === userId);

    const monthGroups: Record<string, any[]> = {};

    for (const event of userEvents) {
      const date = new Date(event.timestamp);
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      if (!monthGroups[key]) {
        monthGroups[key] = [];
      }
      monthGroups[key].push(event);
    }

    const sortedMonths = Object.keys(monthGroups)
      .sort()
      .slice(-M);

    console.log(`Timeline for user ${userId} (last ${M} months):\n`);

    for (const month of sortedMonths) {
      const events = monthGroups[month];
      const songCount: Record<string, number> = {};
      const artistCount: Record<string, number> = {};

      for (const e of events) {
        songCount[e.songId] = (songCount[e.songId] || 0) + 1;
        artistCount[e.artist] = (artistCount[e.artist] || 0) + 1;
      }

      const topSong = Object.entries(songCount).sort((a, b) => b[1] - a[1])[0];
      const topArtist = Object.entries(artistCount).sort((a, b) => b[1] - a[1])[0];

      console.log(`${month}`);
      console.log(`Top Song:   ${topSong[0]} (${topSong[1]} plays)`);
      console.log(`Top Artist: ${topArtist[0]} (${topArtist[1]} plays)\n`);
    }

    break;
  }
  case "payout":
  const [artistRaw, mRaw] = args;
  const artist = artistRaw.toLowerCase();
  const M = parseInt(mRaw);

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - M, 1);

  let totalMinutes = 0;

  for (const event of enrichedData) {
    const eventDate = new Date(event.timestamp);
    const sameArtist = event.artist.toLowerCase() === artist;
    const withinRange = eventDate >= startDate;
    const longEnough = parseInt(event.durationMs) > 10000;

    if (sameArtist && withinRange && longEnough) {
      totalMinutes += parseInt(event.durationMs) / 60000;
    }
  }

  const payout = totalMinutes * 0.001;
  console.log(`Payout for ${artistRaw} over last ${M} months: $${payout.toFixed(2)}`);
  break;

  default:
    console.log("Unknown command:", command);
    console.log("Usage: top-songs <start> <end> <N>");
}
