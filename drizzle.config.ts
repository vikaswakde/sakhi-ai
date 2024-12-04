// import { config } from "dotenv";
// import { defineConfig } from "drizzle-kit";

// config({ path: ".env" });

// export default defineConfig({
//   dialect: "postgresql",
//   schema: "./src/lib/db/schema.ts",
//   // out: "./drizzle",
//   driver: "pglite",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });

import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  driver: "pg",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
