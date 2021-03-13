const express = require("express");

const Tweet = require("../models/tweet.model");
const auth = require("../middleware/auth");
const tweetController = require("../controllers/tweet.controller");

const tweetRouter = new express.Router();

// GET tweets for timeline
// GET /api/tweets/timeline?limit=10&skip=30
tweetRouter.get("/timeline", auth, tweetController.getTimeline);

// GET tweet by its id
tweetRouter.get("/:tweetId", tweetController.getTweet);

// POST a new tweet
tweetRouter.post("/", auth, tweetController.postTweet);

// POST a retweet of <tweetId>
tweetRouter.post("/:tweetId/retweet", auth, tweetController.postRetweet);

// - POST a comment on tweet
tweetRouter.post("/:tweetId/comments", auth, tweetController.postComment);

// - POST a like on tweet
tweetRouter.post("/:tweetId/like", auth, tweetController.postLike);

// - PATCH modify the content of a tweet
tweetRouter.patch("/:tweetId", auth, tweetController.patchTweet);

// - DELETE a tweet
tweetRouter.delete("/:tweetId", auth, tweetController.deleteTweet);

// - DELETE a comment
tweetRouter.delete("/:tweetId/:commentId", auth, tweetController.deleteComment);

// - DELETE like a tweet
tweetRouter.delete("/:tweetId/like", auth, tweetController.deleteLike);

module.exports = tweetRouter;
