import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case.js";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { gymId } = createCheckInsParamsSchema.parse(request.params);

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const createCheckInUseCase = makeCheckInUseCase();

  const checkInCreated = await createCheckInUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub,
    gymId,
  });

  return reply.status(201).send(checkInCreated);
}
