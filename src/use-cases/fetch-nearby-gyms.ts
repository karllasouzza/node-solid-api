import type { Gym } from "generated/prisma/client.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";

interface FetchNearbyGymsUseCaseRequest {
  latitude: number;
  longitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: GymsRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude,
      longitude,
    });

    return { gyms };
  }
}
