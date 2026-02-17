import { prisma } from "@/lib/prisma.js";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.js";
import type { UsersRepository } from "@/repositories/users-repository.js";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";
import type { User } from "generated/prisma/client.js";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
