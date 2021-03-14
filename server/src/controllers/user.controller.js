const sharp = require("sharp");

const User = require("../models/user.model");
const Tweet = require("../models/tweet.model");
const upload = require("../middleware/upload");

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserAvatar = async (req, res) => {
  try {
    const user = req.user;

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const user = req.user;

    await user
      .populate({
        path: "followers",
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
        },
      })
      .execPopulate();

    res.send(user.followers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserFollowees = async (req, res) => {
  try {
    const user = req.user;

    await user
      .populate({
        path: "followees",
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
        },
      })
      .execPopulate();

    res.send(user.followees);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ postedBy: req.user._id }, null, {
      skip: req.query.skip,
      limit: req.query.limit,
      sort: { createdAt: -1 },
    });

    res.send(tweets);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const signUpUser = async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

const logInUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      return res.status(404).send();
    }

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

const logOutUser = async (req, res) => {
  try {
    const user = req.user;

    user.tokens = user.tokens.filter((token) => token.token != req.token);

    await user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const logOutOfAllSessions = async (req, res) => {
  try {
    const user = req.user;

    user.tokens = [];

    await user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const followUser = async (req, res) => {
  try {
    const user = req.user;
    const userToFollow = await User.findOne({ username: req.params.username });

    if (user.equals(userToFollow)) {
      return res.status(400).send();
    }

    const isFollowed = userToFollow.followers.find((userId) =>
      user.equals(userId)
    );

    if (isFollowed) {
      return res.send(); // Keep API Restful
    }

    userToFollow.followers.push(user._id);
    user.followees.push(userToFollow._id);

    await userToFollow.save();
    await user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const putUserAvatar = async (req, res) => {
  const user = req.user;

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 400, height: 400 })
    .png()
    .toBuffer();

  user.avatar = buffer;

  await user.save();

  res.send();
};

const putUserCover = async (req, res) => {
  const user = req.user;

  const buffer = await sharp(req.file.buffer)
    .resize({ width: 1500, height: 500 })
    .png()
    .toBuffer();

  user.cover = buffer;

  await user.save();

  res.send();
};

const updateUserProfile = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["name", "password", "bio"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates." });
  }

  try {
    const user = req.user;

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUserAvatar = async (req, res) => {
  try {
    const user = req.user;
    user.avatar = undefined;
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUserCover = async (req, res) => {
  try {
    const user = req.user;
    user.cover = undefined;
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteFollow = async (req, res) => {
  try {
    const user = req.user;
    const userToFollow = await User.findOne({ username: req.params.username });

    if (user.equals(userToFollow)) {
      return res.status(400).send();
    }

    const isFollowed = userToFollow.followers.find((userId) =>
      user.equals(userId)
    );

    if (!isFollowed) {
      return res.send(); // Keep API Restful
    }

    userToFollow.followers = userToFollow.followers.filter(
      (userId) => !user.equals(userId)
    );
    user.followees = user.followees.filter(
      (userId) => !userToFollow.equals(userId)
    );

    await userToFollow.save();
    await user.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getProfile,
  getUserAvatar,
  getUserFollowers,
  getUserFollowees,
  getUserTweets,
  signUpUser,
  logInUser,
  logOutUser,
  logOutOfAllSessions,
  followUser,
  putUserAvatar,
  putUserCover,
  updateUserProfile,
  deleteUser,
  deleteUserAvatar,
  deleteUserCover,
  deleteFollow,
};
