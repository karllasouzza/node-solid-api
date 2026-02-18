import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
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

  const { token } = authResponse.body;

  return { token, email };
}
