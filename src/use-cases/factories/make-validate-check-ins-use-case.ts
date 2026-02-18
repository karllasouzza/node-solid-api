import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.js";
import { ValidateCheckInUseCase } from "../validate-check-in.js";

export function makeValidateCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInUseCase(checkInsRepository);

  return useCase;
}
