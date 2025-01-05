import { config as configDotenv } from "dotenv";
configDotenv();
export const token = process.env.TOKEN;
export const dbapiendpoint = process.env.DB_API_ENDPOINT;
