import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";

import { GetUserMetricsUseCase } from "./get-user-metrics.js";

describe("Get User Metrics Use Case", () => {
  let checkInRepository: InMemoryCheckInsRepository;
  let sut: GetUserMetricsUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);

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

  it("should be able to fetch user metrics", async () => {
    await checkInRepository.create({
      user_id: "user-123",
      gym_id: "gym-1",
    });

    await checkInRepository.create({
      user_id: "user-123",
      gym_id: "gym-2",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-123",
    });

    expect(checkInsCount).toBe(2);
  });
});
