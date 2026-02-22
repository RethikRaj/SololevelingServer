import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

interface SoloLevelingCharacter {
  id: number;
  name: string;
  rank: string;
  class: string;
  description: string;
}

interface SoloLevelingData {
  series: string;
  characters: SoloLevelingCharacter[];
}

// Load data once
let data: SoloLevelingData;

async function loadData() {
  const rawData = await fs.readFile("./db.json", "utf-8");
  data = JSON.parse(rawData);
}

app.get("/characters", (req: Request, res: Response) => {
  return res.status(200).json({
    data: data.characters,
  });
});

app.get("/characters/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const character = data.characters.find((c) => c.id === id);

  if (!character) {
    return res.status(404).json({ message: "Character not found" });
  }

  return res.status(200).json({ data: character });
});

loadData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});