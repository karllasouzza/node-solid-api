import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { PrismaUsersRepository } from "@/repositories/prisma-users-repository.js";
import { RegisterUseCase } from "@/use-cases/register.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);
    const userCreated = await registerUseCase.execute({
      name,
      email,
      password,
    });

    return reply.status(201).send(userCreated);
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "Unexpected error",
    });
  }
}
