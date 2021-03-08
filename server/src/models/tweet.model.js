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
    retweetedBy: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    content: {
      type: String,
      validate(value) {
        if (this.validate.length > 140) {
          throw new Error("Tweet cannot exceed 140 characters.")
        }
      }
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

// virtual property for isRetweet
tweetSchema.virtual('isRetweet').get(function() {
  return this.retweetedFrom ? true: false
});

// virtual property for numberOfRetweets
tweetSchema.virtual('numberOfRetweets').get(function() {
  return this.retweetedBy.length
});

// virtual property for numberOfLikes
tweetSchema.virtual('numberOfLikes').get(function() {
  return this.likedBy.length
});

// virtual property for numberOfComments
tweetSchema.virtual('numberOfComments').get(function() {
  return this.comments.length
});

// method that converts tweet to JSON 
tweetSchema.methods.toJSON = function () {
  const tweet = this;

  await tweet
  .populate(
    {
      path: 'postedBy',
      select: ['name', 'username']
    },
  ).execPopulate();

  const tweetObject = tweet.toObject();

  delete tweetObject.retweetedBy;
  delete tweetObject.retweetedFrom;
  delete tweetObject.likedBy;
  
  tweetObject = {
    ...tweetObject,
    numberOfRetweets: tweet.numberOfRetweets,
    numberOfLikes: tweet.numberOfLikes,
    numberOfComments: tweet.numberOfComments,
  }

  return tweetObject;
};

const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = Tweet;
