const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    retweetedFrom: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
    content: {
      type: String,
    },
    likedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      new mongoose.Schema(
        {
          postedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
          content: {
            type: String,
            required: True,
          },
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

tweetSchema.index({ postedBy: 1, createdAt: -1 });

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
