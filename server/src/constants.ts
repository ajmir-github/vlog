import dotenv from "dotenv";
import path from "path";
import z from "zod";

dotenv.config();

export const env = z
  .object({
    PORT: z.string().length(4).default("3000"),
    SECRET_KEY: z.string().min(6).default("SECRET_KEY"),
    ENV_MODE: z.enum(["development", "production"]).default("development"),
  })
  .parse(process.env);

export const PublicDirectory = path.join(__dirname, "../", "public");
