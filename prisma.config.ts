import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

type Env = {
  DATABASE_URL: string;
  DIRECT_URL: string;
};

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    url: env<Env>("DIRECT_URL"),
  },
  datasource: {
    url: env<Env>("DATABASE_URL"),
  },
});
