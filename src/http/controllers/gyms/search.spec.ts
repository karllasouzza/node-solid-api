import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";
import { randomUUID } from "node:crypto";

describe("Search Gyms Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search for gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    const uniqueKey = randomUUID();

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: `Gym 1 ${uniqueKey}`,
        description: "Gym Description",
        phone: "1234567890",
        latitude: -21.3984624,
        longitude: -48.4855192,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gym 2",
        description: "Gym Description",
        phone: "1234567890",
        latitude: -21.3984624,
        longitude: -48.4855192,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: uniqueKey,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toEqual(`Gym 1 ${uniqueKey}`);
  });
});
