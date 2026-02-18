import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { randomUUID } from "node:crypto";

describe("Refresh Token Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to refresh a token", async () => {
    const email = `${randomUUID()}@example.com`;

    await request(app.server).post("/users").send({
      name: "John Doe",
      email,
      password: "password123",
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email,
      password: "password123",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies?.join("; ") ?? "")
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
