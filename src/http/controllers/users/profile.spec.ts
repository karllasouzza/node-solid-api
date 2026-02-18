import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app.js";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

describe("Profile Controller (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to get the profile of an authenticated user", async () => {
    const { token, email } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          email,
          name: "John Doe",
        }),
      }),
    );
    expect(response.body.user.password_hash).toBeUndefined();
  });
});
