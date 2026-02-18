import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import type { Environment } from "vitest/environments";

const baseUrl = process.env.DATABASE_URL!;

function generateDatabaseUrl(schema: string) {
  if (!baseUrl) {
    throw new Error("DATABASE_URL environment variable is not defined");
  }

  const url = new URL(baseUrl);
  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "ssr",
  async setup(_global, _options) {
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync(`npx prisma migrate deploy && npx prisma generate`, {
      stdio: "ignore",
      env: {
        ...process.env,
        PRISMA_HIDE_UPDATE_MESSAGE: "true",
      },
    });

    return {
      async teardown() {
        execSync(`npx prisma migrate reset --force`, {
          stdio: "ignore",
          env: {
            ...process.env,
            PRISMA_HIDE_UPDATE_MESSAGE: "true",
          },
        });
      },
    };
  },
};
