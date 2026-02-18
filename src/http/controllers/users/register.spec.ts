import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { randomUUID } from "node:crypto";

describe("Register Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to register a new user", async () => {
    const email = `${randomUUID()}@example.com`;

    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email,
      password: "password123",
    });

    expect(response.statusCode).toBe(201);
  });
});
