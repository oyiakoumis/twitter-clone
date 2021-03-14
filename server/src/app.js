const express = require("express");

require("./db/mongoose");
const userRouter = require("./routes/user.routes");
const tweetRouter = require("./routes/tweet.routes");

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/tweets", tweetRouter);

module.exports = app;
