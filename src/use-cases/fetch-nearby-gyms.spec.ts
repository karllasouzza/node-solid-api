import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";

import { SearchGymsUseCase } from "./search-gyms.js";
import { Decimal } from "@prisma/client/runtime/client";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.js";

describe("Fetch Nearby Gyms Use Case", () => {
  let gymsRepository: InMemoryGymsRepository;
  let sut: FetchNearbyGymsUseCase;

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-21.1014231),
      longitude: new Decimal(-48.396185),
    });

    const { gyms } = await sut.execute({
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: "Near Gym" })]),
    );
  });
});
