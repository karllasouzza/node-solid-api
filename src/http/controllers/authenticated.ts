import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case.js";

export async function authenticated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticatedBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticatedBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const userCreated = await authenticateUseCase.execute({
      email,
      password,
    });

    return reply.status(200).send(userCreated);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
