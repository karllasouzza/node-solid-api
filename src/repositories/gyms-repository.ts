import type { Gym, Prisma } from "generated/prisma/client.js";

export interface FindManyNearByParams {
  userLatitude: number;
  userLongitude: number;
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>;
  searchMany(title: string, page: number): Promise<Gym[]>;
  findManyNearby(params: FindManyNearByParams): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
}
