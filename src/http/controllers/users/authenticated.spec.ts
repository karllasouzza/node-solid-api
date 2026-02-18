import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { randomUUID } from "node:crypto";

describe("Authenticated Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to authenticate a user", async () => {
    const email = `${randomUUID()}@example.com`;

    await request(app.server).post("/users").send({
      name: "John Doe",
      email,
      password: "password123",
    });

    const response = await request(app.server).post("/sessions").send({
      email,
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      user: expect.objectContaining({
        email,
      }),
      token: expect.any(String),
    }));
  });
});
