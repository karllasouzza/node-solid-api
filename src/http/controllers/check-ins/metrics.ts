import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case.js";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const checkInUseCase = makeGetUserMetricsUseCase();

  const { checkInsCount } = await checkInUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
