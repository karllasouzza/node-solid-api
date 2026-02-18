import fastify from "fastify";
import { userRoutes } from "./http/controllers/users/routes.js";
import { ZodError } from "zod";
import { env } from "./env/index.js";
import { gymRoutes } from "./http/controllers/gyms/routers.js";
import { checkInsRouter } from "./http/controllers/check-ins/routers.js";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

app.register(import("@fastify/jwt"), {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});
app.register(fastifyCookie);
app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInsRouter);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV !== "prod") {
    console.error(error);
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});
