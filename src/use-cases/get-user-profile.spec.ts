import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";

import { GetUserProfileUseCase } from "./get-user-profile.js";
import { ResourceNotFoundError } from "./errors/resource-not-found.js";

describe("Get User Profile Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: GetUserProfileUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password_hash: await hash("password123", 10),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user).toBeDefined();
  });

  it("should not be able to get user profile with wrong user ID", async () => {
    await expect(() =>
      sut.execute({
        userId: "wrong-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
