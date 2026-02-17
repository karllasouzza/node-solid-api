import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";

import { FetchUserCheckInsHistoryUseCase } from "./fetch-member-check-ins-history.js";

describe("Fetch User Check-Ins History Use Case", () => {
  let checkInRepository: InMemoryCheckInsRepository;
  let gymsRepository: InMemoryGymsRepository;
  let sut: FetchUserCheckInsHistoryUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);

    // await gymsRepository.create({
    //   id: "gym-123",
    //   title: "Distant Gym",
    //   description: "",
    //   phone: "",
    //   latitude: new Decimal(userLatitude),
    //   longitude: new Decimal(userLongitude),
    // });

    vi.useFakeTimers();
  });

  it("should be able to fetch user check-ins history", async () => {
    await checkInRepository.create({
      user_id: "user-123",
      gym_id: "gym-1",
    });

    await checkInRepository.create({
      user_id: "user-123",
      gym_id: "gym-2",
    });

    const { checkIns } = await sut.execute({
      userId: "user-123",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ user_id: "user-123", gym_id: "gym-1" }),
      expect.objectContaining({ user_id: "user-123", gym_id: "gym-2" }),
    ]);
  });

  it("should be able to fetch paginated user check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        user_id: "user-123",
        gym_id: `gym-${i}`,
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-123",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
  });
});
