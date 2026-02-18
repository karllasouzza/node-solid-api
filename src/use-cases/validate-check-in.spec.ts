import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";

import { ValidateCheckInUseCase } from "./validate-check-in.js";
import { ResourceNotFoundError } from "./errors/resource-not-found.js";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error.js";

describe("Validate Check Ins Use Case", () => {
  let checkInRepository: InMemoryCheckInsRepository;
  let sut: ValidateCheckInUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate a check in", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-123",
      user_id: "user-123",
    });

    const result = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(result.checkIn.validated_at).toEqual(expect.any(Date));
  });

  it("should be not able to validate an inexistent check in", async () => {
    await expect(
      sut.execute({
        checkInId: "inexistent-check-in-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be not able to validate a check in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0)); // January 20, 2024, 08:00:00

    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-123",
      user_id: "user-123",
    });

    const twentyOneMinutesInMilliseconds = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds);
    
    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
