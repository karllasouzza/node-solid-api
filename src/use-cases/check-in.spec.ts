import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/client";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";

import { CheckInUseCase } from "./check-in.js";
import { MaxDistanceError } from "./errors/max-distance-error.js";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-chek-ins-error.js";

describe("use-cases/check-in", () => {
  let checkInRepository: InMemoryCheckInsRepository;
  let gymsRepository: InMemoryGymsRepository;
  let sut: CheckInUseCase;

  const userLatitude = -21.406213;
  const userLongitude = -48.4986839;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-123",
      title: "Distant Gym",
      description: "",
      phone: "",
      latitude: new Decimal(userLatitude),
      longitude: new Decimal(userLongitude),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in a user", async () => {
    const { checkin } = await sut.execute({
      userId: "user-123",
      gymId: "gym-123",
      userLatitude: userLatitude,
      userLongitude: userLongitude,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not allow a user to check in twice on the same day", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0)); // January 20, 2024, 08:00:00

    await sut.execute({
      userId: "user-123",
      gymId: "gym-123",
      userLatitude: userLatitude,
      userLongitude: userLongitude,
    });

    await expect(() =>
      sut.execute({
        userId: "user-123",
        gymId: "gym-123",
        userLatitude: userLatitude,
        userLongitude: userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should allow a user to check in twice on different days", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0)); // January 20, 2024, 08:00:00

    await sut.execute({
      userId: "user-123",
      gymId: "gym-123",
      userLatitude: userLatitude,
      userLongitude: userLongitude,
    });

    vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0)); // January 21, 2024, 08:00:00

    const { checkin } = await sut.execute({
      userId: "user-123",
      gymId: "gym-123",
      userLatitude: userLatitude,
      userLongitude: userLongitude,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0)); // January 20, 2024, 08:00:00

    await gymsRepository.create({
      id: "gym-12",
      title: "Distant Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-21.3984624),
      longitude: new Decimal(-48.4855192),
    });

    await expect(
      sut.execute({
        userId: "user-123",
        gymId: "gym-12",
        userLatitude: userLatitude,
        userLongitude: userLongitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
