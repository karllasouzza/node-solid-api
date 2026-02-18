import type { FastifyInstance } from "fastify";
import { register } from "./register.js";
import { authenticated } from "./authenticated.js";
import { profile } from "./profile.js";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { refresh } from "./refresh.js";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticated);

  app.patch("/token/refresh", refresh)

  // authenticated route
  app.get("/me", { onRequest: [verifyJWT] }, profile);
}
