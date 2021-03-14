const mongoose = require("mongoose");
const Tweet = require("../models/tweet.model");

const getTimeline = async (req, res) => {
  try {
    const user = req.user;

    const tweets = await Tweet.find(
      { postedBy: { $in: user.followers } },
      null,
      {
        projection: { comments: 0 },
        limit: req.query.limit,
        skip: req.query.skip,
        sort: { createdAt: -1 },
      }
    );

    res.send(tweets);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).send();
    }

    res.send(tweet);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postTweet = async (req, res) => {
  try {
    const tweet = new Tweet({
      postedBy: req.user._id,
      content: req.body.content,
    });

    await tweet.save();

    res.send(tweet);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postRetweet = async (req, res) => {
  try {
    const originalTweet = await Tweet.findById(req.params.tweetId);

    if (!originalTweet) {
      return res.status(404).send();
    }

    const isAlreadyRetweeted = originalTweet.retweetedBy.find((userId) =>
      req.user.equals(userId)
    );

    if (isAlreadyRetweeted) {
      return res.send();
    }

    const retweet = new Tweet({
      postedBy: req.user._id,
      retweetedFrom: req.params.tweetId,
    });

    await retweet.save();

    originalTweet.retweetedBy.push(req.user);

    await originalTweet.save();

    res.send(retweet);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postComment = async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).send();
    }

    const tweet = await Tweet.findById(req.params.tweetId);

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      postedBy: req.user._id,
      content: req.body.content,
    };

    tweet.comments.push(comment);

    await tweet.save();

    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    const isLiked = tweet.likedBy.includes(req.user._id);

    if (isLiked) {
      return res.send(); // Keep API Restful
    }

    tweet.likedBy.push(req.user._id);

    await tweet.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const patchTweet = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ["content"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send();
  }

  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (tweet.retweetedFrom) {
      return res.status(400).send({ error: "You can't modify a retweet." });
    }

    tweet.content = req.body.content;

    await tweet.save();

    res.send(tweet);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findByIdAndDelete(req.params.tweetId);
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    const comment = tweet.comments.find((comment) =>
      comment.equals(req.params.commentId)
    );

    if (!req.user.equals(comment.postedBy)) {
      return res.status(400).send({ error: "Deletion not allowed." });
    }

    tweet.comments = tweet.comments.filter(
      (comment) => !comment.equals(req.params.commentId)
    );

    await tweet.save();

    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    const isLiked = tweet.likedBy.find((userId) => req.user.equals(userId));

    if (!isLiked) {
      return res.send(); // Keep API Restful
    }

    tweet.likedBy = tweet.likedBy.filter((userId) => !req.user.equals(userId));

    await tweet.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getTimeline,
  getTweet,
  postTweet,
  postRetweet,
  postComment,
  postLike,
  patchTweet,
  deleteTweet,
  deleteComment,
  deleteLike,
};
