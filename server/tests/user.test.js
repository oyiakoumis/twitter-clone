// TODO: More exhaustive test
const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user.model");
const db = require("./fixtures/db");

beforeEach(db.setupDatabase);
afterEach(db.clearDatabase);

test("Should get my profile", async () => {
  await request(app)
    .get("/api/users/me")
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should get profile from selected user", async () => {
  await request(app).get(`/api/users/${db.userOne._id}`).send().expect(200);
});

test("Should get followers from selected user", async () => {
  await request(app)
    .get(`/api/users/${db.userOne._id}/followers`)
    .send()
    .expect(200);
});

test("Should get followees from selected user", async () => {
  await request(app)
    .get(`/api/users/${db.userTwo._id}/followees`)
    .send()
    .expect(200);
});

test("Should get user's tweets", async () => {
  await request(app)
    .get(`/api/users/${db.userOne._id}/tweets`)
    .send()
    .expect(200);
});

test("Should signup", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      name: "Paul Taylor",
      username: "paultaylor",
      email: "paultaylor@gmail.com",
      password: "qwerty123",
    })
    .expect(201);

  const user = await User.findOne({ email: "paultaylor@gmail.com" });
  expect(user).not.toBeNull();

  expect(user.password).not.toBe("qwerty123");
});

test("Should not signup a user with already taken email", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({
      name: "Paul Taylor",
      username: "paultaylor",
      email: db.userOne.email,
      password: "qwerty123",
    })
    .expect(500);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post(`/api/users/login`)
    .send({
      email: db.userOne.email,
      password: db.userOne.password,
    })
    .expect(200);

  expect(response.body.user).not.toBeNull();
  expect(response.body.token).not.toBeNull();
});

test("Should not login non existing user", async () => {
  const response = await request(app)
    .post(`/api/users/login`)
    .send({
      email: "martindurand@gmail.com",
      password: "qwerty123",
    })
    .expect(500);
});

test("Should logout user", async () => {
  const response = await request(app)
    .post(`/api/users/logout`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(db.userOne._id);

  expect(user.tokens).toHaveLength(1);
});

test("Should logout All sessions", async () => {
  const response = await request(app)
    .post(`/api/users/logout`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(db.userOne._id);

  expect(user.tokens).toHaveLength(0);
});

test("Should put avatar to my profile", async () => {
  const response = await request(app)
    .put(`/api/users/me/avatar`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/avatar.jpg")
    .send()
    .expect(200);

  const user = await User.findById(db.userOne._id);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should patch my profile info", async () => {
  await request(app)
    .patch(`/api/users/me?name=Maria+Sklodowska+Curie`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(db.userOne._id);

  expect(user.name).toEqual("Maria Sklodowska Curie");
});

test("Should not patch username on my profile", async () => {
  await request(app)
    .patch(`/api/users/me?username=mariasklodowska`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(400);
});

test("Should delete my account", async () => {
  await request(app)
    .delete(`/api/users/me`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete not authenticated user", async () => {
  await request(app).delete(`/api/users/me`).send().expect(401);
});

test("Should delete my avatar", async () => {
  await request(app).delete(`/api/users/me/avatar`).send().expect(200);

  const user = await User.findById(db.userOne._id);

  expect(user.avatar).toBeUndefined();
});
