import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { GymUseCase } from "./create-gym.js";

describe("Create Gym Use Case", () => {
  let gymRepository: InMemoryGymsRepository;
  let sut: GymUseCase;

  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new GymUseCase(gymRepository);
  });
  it("should be able to create a new gym", async () => {
    const { gym } = await sut.execute({
      title: "Gym 1",
      description: "Description 1",
      phone: "123456789",
      latitude: -21.3984624,
      longitude: -48.4855192,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
