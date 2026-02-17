import type { Gym, Prisma } from "generated/prisma/client.js";
import type { GymsRepository } from "../gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/client";

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }

    return gym;
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
