import type { FastifyInstance } from "fastify";
import { register } from "./controllers/register.js";
import { authenticated } from "./controllers/authenticated.js";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticated);
}
