import { User } from "../../../../shared/types/user";

function assertUser(user: User) {
  expect(user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      username: expect.any(String),
      fullname: expect.any(String),
      email: expect.any(String),
      imgUrl: expect.any(String),
      isAdmin: expect.any(Boolean),
    })
  );

  expect(typeof user.createdAt === "string" || typeof user.createdAt === "object").toBeTruthy();
}

export { assertUser };
