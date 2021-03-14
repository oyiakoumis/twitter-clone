const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../../src/models/user.model");
const Tweet = require("../../src/models/tweet.model");

const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Marie Curie",
  username: "mariecurie",
  bio: "Hi, my name is Odysseas and I am doing a MERN project.",
  email: "mariecurie@gmail.com",
  password: "marie12345",
  followers: [userTwoId],
  tokens: [
    {
      token: jwt.sign({ _id: userOneId.toString() }, process.env.JWT_SECRET),
    },
  ],
};

const userTwo = {
  _id: userTwoId,
  name: "John Smith",
  username: "john",
  bio: "Hi, I am the second user on twitter.",
  email: "john@smith.com",
  password: "qwerty123",
  followees: [userOne._id],
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const commentOne = {
  _id: new mongoose.Types.ObjectId(),
  postedBy: userTwo._id,
  content: "Hello there!",
};

const tweetOne = {
  _id: new mongoose.Types.ObjectId(),
  postedBy: userOne._id,
  content: "This a my first tweet!",
  likedBy: [userTwo._id],
  comments: [commentOne],
};

const tweetTwo = {
  _id: new mongoose.Types.ObjectId(),
  postedBy: userOne._id,
  content: "I hope this tweet will be retweeted!",
  retweetedBy: [userTwo._id],
};

const retweetOne = {
  _id: new mongoose.Types.ObjectId(),
  postedBy: userTwo._id,
  retweetedFrom: tweetOne._id,
};

const setupDatabase = async () => {
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Tweet(tweetOne).save();
  await new Tweet(tweetTwo).save();
  await new Tweet(retweetOne).save();
};

const clearUpDatabase = async () => {
  await User.deleteMany();
  await Tweet.deleteMany();
};

module.exports = {
  userOne,
  userTwo,
  commentOne,
  tweetOne,
  tweetTwo,
  retweetOne,
  setupDatabase,
  clearUpDatabase,
};
