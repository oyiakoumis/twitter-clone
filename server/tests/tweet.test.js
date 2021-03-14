// TODO: More exhaustive test
const request = require("supertest");

const app = require("../src/app");
const Tweet = require("../src/models/tweet.model");
const db = require("./fixtures/db");

beforeAll(() => db.clearUpDatabase());
beforeEach(() => db.setupDatabase());
afterEach(() => db.clearUpDatabase());

test("Should get a tweet by its id", async () => {
  await request(app)
    .get(`/api/tweets/${db.tweetOne._id.toString()}`)
    .send()
    .expect(200);
});

test("Should post a new tweet", async () => {
  await request(app)
    .post(`/api/tweets/`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send({
      content: "Hi this is a new tweet!",
    })
    .expect(200);

  const tweets = await Tweet.find({
    postedBy: db.userOne._id,
  });

  expect(tweets).toHaveLength(3);
});

test("Should not post a tweet with content longer that 140 characters", async () => {
  await request(app)
    .post(`/api/tweets/`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send({
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec pharetra mi non massa interdum efficitur.
        Suspendisse maximus eleifend ipsum eget suscipit.
        Cras nec purus id magna vulputate vulputate.`,
    })
    .expect(500);
});

test("Should not post a tweet if user is not authenticated", async () => {
  await request(app)
    .post(`/api/tweets/`)
    .send({
      content: "Hi this is a new tweet!",
    })
    .expect(401);
});

test("Should post a retweet", async () => {
  const response = await request(app)
    .post(`/api/tweets/${db.tweetOne._id}/retweet`)
    .set("Authorization", `Bearer ${db.userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  const tweet = await Tweet.findById(response.body._id);

  expect(tweet.content).toBeUndefined();
});

test("Should post a comment", async () => {
  await request(app)
    .post(`/api/tweets/${db.tweetTwo._id}/comments`)
    .set("Authorization", `Bearer ${db.userTwo.tokens[0].token}`)
    .send({ content: "Awesome tweet!" })
    .expect(200);

  const tweet = await Tweet.findById(db.tweetTwo._id);

  expect(tweet.comments).toHaveLength(1);
});

test("Should post a like", async () => {
  await request(app)
    .post(`/api/tweets/${db.tweetTwo._id}/like`)
    .set("Authorization", `Bearer ${db.userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  const tweet = await Tweet.findById(db.tweetTwo._id);

  expect(tweet.likedBy[0]).toEqual(db.userTwo._id);
});

test("Should patch a tweet", async () => {
  await request(app)
    .patch(`/api/tweets/${db.tweetTwo._id}`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send({ content: "Modified tweet!" })
    .expect(200);

  const tweet = await Tweet.findById(db.tweetTwo._id);

  expect(tweet.content).toEqual("Modified tweet!");
});

test("Should delete a tweet", async () => {
  await request(app)
    .delete(`/api/tweets/${db.tweetTwo._id}`)
    .set("Authorization", `Bearer ${db.userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const tweet = await Tweet.findById(db.tweetTwo._id);

  expect(tweet).toBeNull();
});

test("Should not delete other user tweet", async () => {
  await request(app)
    .delete(`/api/tweets/${db.tweetTwo._id}`)
    .set("Authorization", `Bearer ${db.userTwo.tokens[0].token}`)
    .send()
    .expect(401);

  const tweet = await Tweet.findById(db.tweetTwo._id);

  expect(tweet).not.toBeNull();
});

test("Should delete a comment", async () => {
  await request(app)
    .delete(`/api/tweets/${db.tweetOne._id}/comments/${db.commentOne._id}`)
    .set("Authorization", `Bearer ${db.userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  const tweet = await Tweet.findById(db.tweetOne._id);

  expect(tweet.comments).toHaveLength(0);
});

test("Should delete a like", async () => {
  await request(app)
    .delete(`/api/tweets/${db.tweetOne._id}/like`)
    .set("Authorization", `Bearer ${db.userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  const tweet = await Tweet.findById(db.tweetOne._id);

  expect(tweet.likedBy).toHaveLength(0);
});
