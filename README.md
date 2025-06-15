# 🎵 Music Enrichment – Analytics CLI & Ingestion Script

**Submitted by:** Jorge Dominguez  
**Position:** Sr. / Staff Solutions Engineer  
**Client:** Turnstile (via Hireworks)  
**Location:** Colombia

This project implements an analytics CLI and an ingestion script for music stream data enrichment. It was developed as part of a technical test and includes:

- A standalone ingestion script that enriches the dataset.
- A server to serve test endpoints and JSON output.
- A CLI that supports analytics commands such as top songs, user timelines, and royalty payouts.

---

## Getting Started

Make sure you have the project dependencies installed and TypeScript configured. Then run:

```bash
npm install
```

---

## Project Structure

- `server.ts`: Runs a local server (port `3005`) for testing and viewing JSON results.
- `scripts/ingest.ts`: Enriches the stream data with related song and artist metadata.
- `cli/cli.ts`: CLI script with analytics commands.

---

## Data Ingestion

Before using the CLI, you must enrich the data.

### Run the ingestion script:

```bash
npx ts-node scripts/ingest.ts
```

This script processes the input files and outputs a JSON file (`output.json`), placed at `static/data.ts`.

You can run the server with:

```bash
npx ts-node server.ts
```

---

## Part 2 – Analytics CLI

Your CLI supports the following commands:

### 1. `top-songs <start> <end> <N>`

Returns the top N songs (by play count) between two ISO-8601 timestamps.

#### Example:

```bash
npx ts-node cli/cli.ts top-songs 2025-03-30T00:00:00Z 2025-04-01T00:00:00Z 5
```

**Output:**

```
Top 5 Songs from 2025-03-30T00:00:00Z to 2025-04-01T00:00:00Z
2b51a930-f565-4e85-aaeb-2a2bae4a7bda: 2 plays
d9b53215-0f91-4daf-94d4-5229f5109ece: 2 plays
db68df62-26d6-4204-bdc6-41dbfba7a315: 2 plays
52e960a6-1306-4701-a800-a5fa1a7a6762: 2 plays
c198b688-84fd-42fd-afc1-777364a68eeb: 1 plays
...
```

---

### 2. `timeline <userId> <months>`

Displays top song and artist per month for the last `M` months for the specified user.

#### Example:

```bash
npx ts-node cli/cli.ts timeline 724e10de-23b3-4b79-a3ba-70c8787fa3fe 3
```

**Output:**

```
Timeline for user 724e10de-23b3-4b79-a3ba-70c8787fa3fe (last 3 months):

2025-03
Top Song:   5ede3121-872a-497c-9c09-ccac45be6bc2 (1 plays)
Top Artist: Billie Holiday (1 plays)

2025-04
Top Song:   79ae8c18-4e36-4091-b408-1a57bbffdd4f (6 plays)
Top Artist: Herbie Hancock (7 plays)
...
```

---

### 3. `payout <artist> <months>`

Calculates the royalty payout for a given artist over the last `M` months. Only streams longer than 10 seconds are considered.

#### Example:

```bash
npx ts-node cli/cli.ts payout "Charlie Parker" 20
```

**Output:**

```
Payout for Charlie Parker over last 20 months: $0.04
```

#### Example:

```bash
npx ts-node cli/cli.ts payout "Miles Davis" 50
```

**Output:**

```
Payout for Miles Davis over last 50 months: $0.06
```

---

## Step-by-Step Usage

To run and test the full project, follow these steps in order:

### 1. Run the Server

Start the test server on port `3005`, which serves endpoints and JSON output for validation:

```bash
npx ts-node server.ts
```

Access it at: [http://localhost:3005](http://localhost:3005)

---

### 2. Run the Ingestion Script

This step enriches the stream data by combining song and artist metadata.

```bash
npx ts-node scripts/ingest.ts
```

This command will generate a file:  
`static/data.ts`  
which includes the enriched `output.json` used for testing and analytics.

---

### 3. Verify Enriched Output

Check that the `output.json` contains the combined data for songs, users, and artists.  
You can verify this by accessing the server endpoint (once the server is running):

---

### 4. Run CLI Commands

With the enriched dataset in place, you're ready to run the CLI analytics commands such as:

- `top-songs <start> <end> <N>`
- `timeline <userId> <months>`
- `payout <artist> <months>`

Example:

```bash
npx ts-node cli/cli.ts top-songs 2025-03-30T00:00:00Z 2025-04-01T00:00:00Z 5
```

---

## 🌐 Notes

- The server runs on `http://localhost:3005`
- All commands are executed using `npx ts-node` and assume TypeScript is configured in the environment.
- The project was implemented and tested locally on a MacBook Pro M3.
