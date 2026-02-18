import { prisma } from "@/lib/prisma.js";
import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin?: boolean) {
  const email = `${randomUUID()}@example.com`;

  const userCreated = await prisma.user.create({
    data: {
      name: "John Doe",
      email,
      password_hash: await hash("password123", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  })

  const authResponse = await request(app.server).post("/sessions").send({
    email: userCreated.email,
    password: "password123",
  });

  const { token, user } = authResponse.body;

  return { token, email, user };
}
