import type { Gym } from "generated/prisma/client.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface GymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface GymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute(data: GymUseCaseRequest): Promise<GymUseCaseResponse> {
    const gym = await this.gymRepository.create(data);

    if (!gym) {
      throw new Error("Failed to create gym");
    }

    return { gym };
  }
}
