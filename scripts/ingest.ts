import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import fetch from "node-fetch";

interface EventRecord {
  userId: string;
  songId: string;
  timestamp: string;
  durationMs: string;
}

interface SongMetadata {
  songId: string;
  title: string;
  artist: string;
  releaseDate: string;
}

interface EnrichedEvent extends EventRecord, SongMetadata {}

async function readCSV(filePath: string): Promise<EventRecord[]> {
  const events: EventRecord[] = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [userId, songId, timestamp, durationMs] = line.split(",");
    if (userId === "userId") continue; // Skip header
    events.push({ userId, songId, timestamp, durationMs });
  }

  return events;
}

async function fetchSongMetadata(songId: string): Promise<SongMetadata | null> {
  try {
    const res = await fetch(`http://localhost:3005/songs/${songId}`);
    if (!res.ok) {
      console.warn(`Song not found for ID ${songId} (Status: ${res.status})`);
      return null;
    }
    const json = await res.json();
    return json as SongMetadata;
  } catch (err) {
    console.error(`Error fetching song ${songId}:`, (err as Error).message);
    return null;
  }
}

async function main() {
  console.log("Ingestion script started");

  const csvPath = path.join(__dirname, "../static/data/streamingEvents.csv");
  const outputPath = path.join(__dirname, "../static/data/output.json");

  try {
    const events = await readCSV(csvPath);
    const enrichedEvents: EnrichedEvent[] = [];

    for (const [i, event] of events.entries()) {
      const metadata = await fetchSongMetadata(event.songId);
      if (metadata) {
        enrichedEvents.push({ ...event, ...metadata });
      } else {
        console.warn(`Skipping event ${i} due to missing metadata.`);
      }
    }

    fs.writeFileSync(outputPath, JSON.stringify(enrichedEvents, null, 2));
    console.log(`${enrichedEvents.length} enriched events written to ${outputPath}`);
  } catch (error) {
    console.error("Ingestion failed:", error);
    throw error;
  }
}

export async function runIngestion() {
  await main();
}

if (require.main === module) {
  runIngestion().catch((err) => {
    console.error("Unhandled error in main:", err);
    process.exit(1);
  });
}


