const express = require("express");

const Tweet = require("../models/tweet.model");
const auth = require("../middleware/auth");
const tweetController = require("../controllers/tweet.controller");

const tweetRouter = new express.Router();

// - POST /api/tweets/:tweetId/comments
// - POST /api/tweets/:tweetId/like

// - PATCH /api/tweets/:tweetId

// - DELETE /api/tweets/:tweetId
// - DELETE /api/tweets/:tweetId/comments
// - DELETE /api/tweets/:tweetId/like

// GET tweets for timeline
// GET /api/tweets/timeline?limit=10&skip=30
tweetRouter.get("/timeline", auth, async (req, res) => {
  try {
    const user = req.user;

    const tweets = await Tweet.find(
      { postedBy: { $in: user.followers } },
      null,
      {
        projection: { comments: 0 },
        limit: req.query.limit,
        skip: req.query.skip,
        sort: [["createdAt", -1]],
      }
    );

    res.send(tweets);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET tweet by its id
tweetRouter.get("/:tweetId", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      res.status(404).send();
    }

    res.send(tweet);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST a new tweet
tweetRouter.post("/", auth, async (req, res) => {
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
});

// POST a retweet of <tweetId>
tweetRouter.post("/:tweetId/retweet", auth, async (req, res) => {
  try {
    const originalTweet = await Tweet.findById(req.params.tweetId, {
      projection: { retweetBy: 1 },
    });

    const isAlreadyRetweeted = originalTweet.retweetBy.find(
      (user) => user._id == req.user._id
    );

    if (isAlreadyRetweeted) {
      res.status(400).send({ error: "Tweet has already been retweeted." });
    }

    const retweet = new Tweet({
      postedBy: req.user._id,
      retweetedFrom: req.params.tweetId,
    });

    await retweet.save();
    res.send(retweet);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = tweetRouter;