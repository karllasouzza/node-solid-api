import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  DATABASE_URL: z
    .string()
    .default(
      "postgresql://docker:docker@localhost:5433/apisolid?schema=public",
    ),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  throw new Error("Invalid environment variables", {
    cause: _env.error.format(),
  });
}

export const env = _env.data;
