import { config as configDotenv } from "dotenv";
configDotenv();

import express from "express";
import { calculateAverages, fetchData, generateInsights } from "./hackathon.js";
const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Engagify API");
});

const response = async function analyzeEngagement() {
  const data = await fetchData();
  const averages = calculateAverages(data);
  const insights = await generateInsights(averages);
  return insights;
};

app.get("/analyze", async (req, res) => {
  const insights = await response();
  res.send(insights);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
