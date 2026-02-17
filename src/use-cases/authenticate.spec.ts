import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

describe("Authenticate Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate a user with valid credentials", async () => {
    await usersRepository.create({
      name: "Test User",
      email: "test@example.com",
      password_hash: await hash("password123", 10),
    });

    const { user } = await sut.execute({
      email: "test@example.com",
      password: "password123",
    });

    expect(user).toBeDefined();
  });

  it("should not be able to authenticate a user with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "wrong@example.com",
        password: "password123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate a user with wrong password", async () => {
    await expect(() =>
      sut.execute({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
