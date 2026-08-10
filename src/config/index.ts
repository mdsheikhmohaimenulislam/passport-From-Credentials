import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
  // Allow .env files with CRLF line endings (common on Windows).
  // dotenv v17+ does not parse \r by default and silently loads nothing otherwise.
  quiet: true,
});

if (!process.env.DATABASE_URL) {
  console.warn(
    "[config] DATABASE_URL missing — does your .env have CRLF line endings? Falling back to safe defaults.",
  );
}

export default {
  port: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
  database_url: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  GOOGLE_CLIENT_CALLBACK_URL: process.env.GOOGLE_CLIENT_CALLBACK_URL!,
};
