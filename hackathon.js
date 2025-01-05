import { config as configDotenv } from "dotenv";
configDotenv();
import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { token, dbapiendpoint } from "./constants.js";

// API token and endpoint
const client = new DataAPIClient(token);
const db1 = client.db(dbapiendpoint);

export async function fetchData() {
  try {
    const data = await db1.collection("social").find().toArray();
    return data;
  } catch (error) {
    return error;
  }
}

export async function generateInsights(averages) {
  const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Based on the following average engagement metrics:
    - Carousel: ${averages.carousel.likes} likes, ${averages.carousel.shares} shares, ${averages.carousel.comments} comments
    - Reels: ${averages.reel.likes} likes, ${averages.reel.shares} shares, ${averages.reel.comments} comments
    - Static: ${averages.static.likes} likes, ${averages.static.shares} shares, ${averages.static.comments} comments
    
    Provide insights comparing the performance of these post types.
  `;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export function calculateAverages(data) {
  const postTypes = ["carousel", "reel", "static"];
  let averages = {};

  postTypes.forEach((type) => {
    const filteredData = data.filter((post) => post.post_type === type);
    const totalLikes = filteredData.reduce((acc, post) => acc + post.likes, 0);
    const totalShares = filteredData.reduce(
      (acc, post) => acc + post.shares,
      0
    );
    const totalComments = filteredData.reduce(
      (acc, post) => acc + post.comments,
      0
    );

    averages[type] = {
      likes: totalLikes / filteredData.length,
      shares: totalShares / filteredData.length,
      comments: totalComments / filteredData.length,
    };
  });

  return averages;
}
