import type { Gym, Prisma } from "generated/prisma/client.js";

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  searchMany(title: string, page: number): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
