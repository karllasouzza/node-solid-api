import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register.js";
import bcrypt from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";

describe("use-cases/register", () => {
  let userRepository: InMemoryUsersRepository;
  let sut: RegisterUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(userRepository);
  });
  it("should be able to register a new user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const user = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    const { user: userCreated } = await sut.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const isPasswordCorrectHash = await bcrypt.compare(
      user.password,
      userCreated.password_hash,
    );

    expect(isPasswordCorrectHash).toBe(true);
  });

  it("should not allow registration with same email twice", async () => {
    const user = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    await sut.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    await expect(() =>
      sut.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
