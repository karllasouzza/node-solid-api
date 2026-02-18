import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/use-cases/**/*.spec.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          include: ["src/http/controllers/**/*.spec.ts"],
          environment:
            "./prisma/vitest-environment-prisma/prisma-test-environment.ts",
        },
      },
    ],
  },
});
