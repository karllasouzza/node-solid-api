# node-solid-api

[![E2E Tests](https://github.com/karllasouzza/node-solid-api/actions/workflows/run-e2e-tests.yml/badge.svg)](https://github.com/karllasouzza/node-solid-api/actions/workflows/run-e2e-tests.yml)
![Node](https://img.shields.io/badge/node-24.x-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-5.x-000000?logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/prisma-7.x-2D3748?logo=prisma&logoColor=white)
![Vitest](https://img.shields.io/badge/vitest-4.x-6E9F18?logo=vitest&logoColor=white)

GymPass-style API built with Node.js, Fastify, Prisma, and TypeScript.

> ⚠️ **This is a study project**, created to practice software architecture, SOLID principles, JWT authentication, and automated testing (unit + e2e).

## About the project

This project simulates an API for managing users, gyms, and check-ins.

Main learning goals:

- building a REST API with Fastify;
- separating responsibilities by layers (`controllers`, `use-cases`, `repositories`);
- persistence with Prisma + PostgreSQL;
- authentication and authorization with JWT and roles (`MEMBER` and `ADMIN`);
- automated tests with Vitest (unit and end-to-end).

## Tech stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **HTTP Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: `@fastify/jwt` + `@fastify/cookie`
- **Password hashing**: `bcryptjs`
- **Testing**: Vitest + Supertest
- **Build**: tsup
- **Lint/Format**: ESLint + Prettier

## Architecture and organization

The project follows a use-case-oriented approach:

- `src/http/controllers`: HTTP entry layer (routes, request/response);
- `src/use-cases`: application business rules;
- `src/repositories`: persistence contracts;
- `src/repositories/prisma`: real database implementations;
- `src/repositories/in-memory`: unit-test implementations;
- `src/http/middlewares`: auth middlewares (`verify-jwt` and `verify-user-role`);
- `src/use-cases/factories`: use-case composition with dependencies.

## Data model

### `User`

- `id`
- `name`
- `email` (unique)
- `password_hash`
- `role` (`ADMIN` | `MEMBER`)
- `createdAt`

### `Gym`

- `id`
- `title`
- `description` (optional)
- `phone` (optional)
- `latitude`
- `longitude`
- `createdAt`

### `CheckIn`

- `id`
- `createdAt`
- `validated_at` (optional)
- `user_id` (relation with `User`)
- `gym_id` (relation with `Gym`)

## Features

- User registration;
- Authentication (login);
- Token refresh via HTTP-only cookie;
- Get authenticated user profile;
- Search gyms by name (with pagination);
- Fetch nearby gyms by coordinates;
- Create gym (admin only);
- Perform gym check-in;
- Validate check-in (admin only);
- User check-in history (with pagination);
- User check-in metrics.

## Business rules

- Do not allow duplicate users with the same email;
- Do not allow two check-ins on the same day for the same user;
- Do not allow check-in if the user is too far from the gym (distance threshold);
- Check-in can only be validated inside the configured validation time window;
- Only `ADMIN` can create gyms;
- Only `ADMIN` can validate check-ins.

## Non-functional requirements

- Passwords stored as hash (`bcryptjs`);
- PostgreSQL persistence;
- Pagination for list endpoints;
- JWT-based authentication;
- Unit and e2e automated test coverage.

## API endpoints

Local base URL: `http://localhost:3000`

### Users and authentication

- **POST /users**
  Creates a user.

  Example body:

  ```json
  {
    "name": "John",
    "email": "john@email.com",
    "password": "123456"
  }
  ```

- **POST /sessions**
  Authenticates user.

  Example body:

  ```json
  {
    "email": "john@email.com",
    "password": "123456"
  }
  ```

  Returns `token` and sets `refreshToken` cookie.

- **PATCH /token/refresh**
  Generates a new access token from `refreshToken` cookie.

- **GET /me** (authenticated)
  Returns profile of logged-in user.

### Gyms

- **GET /gyms/search** (authenticated)
  Query params: `q` (string), `page` (number, optional).

- **GET /gyms/nearby** (authenticated)
  Query params: `latitude` (number), `longitude` (number).

- **POST /gyms** (authenticated + `ADMIN` role)
  Example body:

  ```json
  {
    "title": "Gym Center",
    "description": "Full service gym",
    "phone": "11999999999",
    "latitude": -23.55052,
    "longitude": -46.633308
  }
  ```

### Check-ins

- **POST /gyms/:gymId/check-ins** (authenticated)
  Example body:

  ```json
  {
    "latitude": -23.55052,
    "longitude": -46.633308
  }
  ```

- **GET /check-ins/history** (authenticated)
  Query params: `page` (number, optional).

- **GET /check-ins/metrics** (authenticated)
  Returns total check-ins count for the user.

- **PATCH /check-ins/:checkInId/validate** (authenticated + `ADMIN` role)
  Validates a check-in.

## Running locally

### Prerequisites

- Node.js (version 24 recommended, aligned with CI);
- Corepack enabled;
- Yarn 4;
- Docker and Docker Compose.

### 1) Clone and install dependencies

```bash
git clone https://github.com/karllasouzza/node-solid-api.git
cd node-solid-api
corepack enable
yarn install
```

### 2) Configure environment variables

Create a `.env` file (you can copy from `.env.example`) and fill in:

```env
NODE_ENV=dev
PORT=3000
JWT_SECRET=your_super_secret_key
DATABASE_URL=postgresql://docker:docker@localhost:5433/apisolid?schema=public
```

### 3) Start database with Docker

```bash
docker compose up -d
```

### 4) Run migrations and generate Prisma client

```bash
yarn prisma migrate deploy
yarn prisma generate
```

> Alternative for schema development:
>
> ```bash
> yarn prisma migrate dev --name your_change_name
> ```

### 5) Start API

```bash
yarn dev
```

Server runs at `http://localhost:3000`.

## Available scripts

- `yarn dev`: starts server in development mode;
- `yarn build`: builds files into `build/`;
- `yarn start`: runs production build;
- `yarn lint`: runs lint;
- `yarn lint:fix`: runs lint with auto-fix;
- `yarn test`: runs unit tests (`project: unit`);
- `yarn test:e2e`: runs e2e tests (`project: e2e`);
- `yarn test:watch`: watch mode for unit tests;
- `yarn test:e2e:watch`: watch mode for e2e tests;
- `yarn test:coverage`: runs test coverage;
- `yarn test:ui`: opens Vitest UI.

## Tests

- **Unit**: focused on business rules (`src/use-cases/**/*.spec.ts`);
- **E2E**: focused on HTTP layer (`src/http/controllers/**/*.spec.ts`).

Run both:

```bash
yarn test
yarn test:e2e
```

## Continuous integration (CI)

The CI workflow runs e2e tests on push and pull requests to `main`, starts PostgreSQL as a GitHub Actions service, and applies migrations before tests.

## Directory structure (summary)

```text
src/
  app.ts
  server.ts
  env/
  http/
    controllers/
    middlewares/
  lib/
  repositories/
    in-memory/
    prisma/
  use-cases/
    errors/
    factories/
prisma/
  schema.prisma
  migrations/
```

## Final notes

- This repository is intended for **study and practice**.
- Improvements and refactors are part of the learning process.
- Suggestions, issues, and pull requests are welcome.
