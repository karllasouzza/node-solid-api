import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "@/env/index.js";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({
      onlyCookie: true,
    });
  } catch {
    return reply.status(401).send({
      message: "Unauthorized",
    });
  }

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
      },
    },
  );

  const refreshToken = await reply.jwtSign(
    {
      role: request.user.role,
    },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: "7d",
      },
    },
  );

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: env.NODE_ENV === "prod",
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
}
