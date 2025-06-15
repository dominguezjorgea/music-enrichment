import express, { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { runIngestion } from "../scripts/ingest";

const app = express();
const port = 3005;

console.log("Starting application");

const loadSongsData = () => {
  try {
    const songsFilePath = path.join(__dirname, "../static/data/songs.json");
    const songsData = JSON.parse(fs.readFileSync(songsFilePath, "utf8"));
    return songsData;
  } catch (error) {
    console.error("Error loading songs data:", error);
    return { songs: [] };
  }
};

app.use("/static", express.static(path.join(__dirname, "../static")));

app.get("/test", (_req: Request, res: Response) => {
  res.send({ message: "Hello World!" });
});

app.get("/songs/:songId", (req: Request, res: Response): void => {
  try {
    const { songId } = req.params;
    const songsData = loadSongsData();
    const song = songsData.songs.find((s: any) => s.songId === songId);

    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    res.json(song);
  } catch (err) {
    console.error("Error retrieving song:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/enrich", async (_req: Request, res: Response) => {
  try {
    await runIngestion();
    res.status(200).json({ message: "Enrichment completed and saved to output.json." });
  } catch (error) {
    console.error("Error running ingestion:", error);
    res.status(500).json({ error: "Failed to enrich data." });
  }
});

app.get("/enriched-data", (_req: Request, res: Response) => {
  try {
    const outputPath = path.join(__dirname, "../static/data/output.json");
    const data = fs.readFileSync(outputPath, "utf8");
    res.type("application/json").send(data);
  } catch (error) {
    console.error("Error reading output.json:", error);
    res.status(500).json({ error: "Unable to read output file." });
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
