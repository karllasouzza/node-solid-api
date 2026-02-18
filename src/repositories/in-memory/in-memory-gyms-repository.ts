import type { Gym, Prisma } from "generated/prisma/client.js";
import type { FindManyNearByParams, GymsRepository } from "../gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/client";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates.js";

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }
  async searchMany(query: string, page: number) {
    const gyms = this.gyms.filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()));

    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;

    return gyms.slice(startIndex, endIndex);
  }
  async findManyNearby(params: FindManyNearByParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
        {
          latitude: new Decimal(params.latitude).toNumber(),
          longitude: new Decimal(params.longitude).toNumber(),
        },
      );
      return distance < 10;
    });

  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? crypto.randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(String(data.latitude)),
      longitude: new Decimal(String(data.longitude)),
      createdAt: new Date(),
    };

    this.gyms.push(gym);

    return gym;
  }
}
