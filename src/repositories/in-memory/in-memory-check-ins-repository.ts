import type { CheckIn, Prisma } from "generated/prisma/client.js";
import type { CheckInsRepository } from "../check-ins-repository.js";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private checkIns: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("day");
    const endOfTheDay = dayjs(date).endOf("day");


    const checkInOnSameDate = this.checkIns.find(
      (checkIn) => {
        const checkInDate = dayjs(checkIn.createdAt);
        const isOnSameDay = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
        
        return checkIn.user_id === userId && isOnSameDay;
      }    
    );

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: crypto.randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      createdAt: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }
}
