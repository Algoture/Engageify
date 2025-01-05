import { config as configDotenv } from "dotenv";
configDotenv();
export const token = process.env.TOKEN;
export const dbapiendpoint = process.env.DB_API_ENDPOINT;
export const clientId = `${process.env.CLIENT_ID}`;
export const clientSecret = `${process.env.CLIENT_SECRET}`;
