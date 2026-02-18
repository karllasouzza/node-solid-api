import { CreateGymUseCase } from "../create-gym.js";
import { PrismaGymsRepository } from "@/repositories/prisma/prima-gyms-repository.js";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
}
