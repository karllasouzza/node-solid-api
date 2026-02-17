import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";

import { SearchGymsUseCase } from "./search-gyms.js";
import { Decimal } from "@prisma/client/runtime/client";

describe("Search Gyms Use Case", () => {
  let gymsRepository: InMemoryGymsRepository;
  let sut: SearchGymsUseCase;

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);

    vi.useFakeTimers();
  });

  it("should be able to search gyms by query", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    await gymsRepository.create({
      title: "TypeScript Gym2",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    const { gyms } = await sut.execute({
      query: "Gym2",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
  });

  it("should be able to fetch paginated gyms by search query", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: "",
        phone: "",
        latitude: new Decimal(0),
        longitude: new Decimal(0),
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
