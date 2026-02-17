import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";

import { FetchUserCheckInsHistoryUseCase } from "./fetch-member-check-ins-history.js";

describe("Fetch User Check-Ins History Use Case", () => {
  let checkInRepository: InMemoryCheckInsRepository;
  let sut: FetchUserCheckInsHistoryUseCase;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);

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
