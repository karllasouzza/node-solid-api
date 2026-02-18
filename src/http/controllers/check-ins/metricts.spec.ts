import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";
import { prisma } from "@/lib/prisma.js";

describe("Metrics Check-in Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list the metrics of check-ins", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Gym Name",
        latitude: -21.3984624,
        longitude: -48.4855192,
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
