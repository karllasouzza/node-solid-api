import { prisma } from "@/lib/prisma.js";
import type { GymCreateInput } from "generated/prisma/models.js";
import type {
  FindManyNearByParams,
  GymsRepository,
} from "../gyms-repository.js";
import type { Gym } from "generated/prisma/client.js";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    });

    return gym;
  }

  async searchMany(title: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearByParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }

  async create(data: GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }
}
