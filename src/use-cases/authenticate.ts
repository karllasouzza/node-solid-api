import type { UsersRepository } from "@/repositories/users-repository.js";
import type { User } from "generated/prisma/client.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";
import bcrypt from "bcryptjs";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
