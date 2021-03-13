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
        sort: [["createdAt", -1]],
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
      res.status(404).send();
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
};

const postComment = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    tweet.comments.push({
      postedBy: req.user._id,
      content: req.body.content,
    });

    await tweet.save();

    res.send(tweet);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    const isLiked = tweet.likedBy.includes(req.user._id);

    if (isLiked) {
      res.status(400).send({ error: "Tweet is already liked." });
    }

    tweet.likedBy.push(req.user._id);

    await tweet.save();

    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const patchTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (tweet.retweetedFrom) {
      res.status(400).send({ error: "You can't modify a retweet." });
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
    const comment = tweet.comments.find(
      (comment) => comment._id == req.params.commentId
    );

    if (comment.postedBy != req.user._id) {
      res.status(400).send({ error: "Deletion not allowed." });
    }

    tweet.comments = tweet.comments.filter(
      (comment) => comment._id != req.params.commentId
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
    const isLiked = tweet.likedBy.find((userId) => userId == req.user._id);

    if (!isLiked) {
      res.status(400).send({ error: "Tweet isn't liked." });
    }

    tweet.likedBy = tweet.likedBy.filter((userId) => userId != req.user._id);

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
