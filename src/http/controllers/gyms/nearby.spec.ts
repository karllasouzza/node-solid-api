import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";
import { randomUUID } from "node:crypto";

describe("Nearby Gyms Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to fetch nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    const uniqueKey = randomUUID();

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: `Gym near ${uniqueKey}`,
        description: "Gym Description",
        phone: "1234567890",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: `Gym far ${uniqueKey}`,
        description: "Gym Description",
        phone: "1234567890",
        latitude: -21.1014231,
        longitude: -48.396185,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: `Gym near ${uniqueKey}`,
        }),
      ]),
    );

    const nearbyGym = response.body.find(
      (gym: { title: string }) => gym.title === `Gym near ${uniqueKey}`,
    );

    expect(Number(nearbyGym.latitude)).toEqual(-27.2092052);
    expect(Number(nearbyGym.longitude)).toEqual(-49.6401091);
  });
});
