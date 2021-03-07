const express = require("express");

require("./db/mongoose");
const userRouter = require("./routes/user");
// const tweetRouter = require("./routes/tweet");

const app = express();

app.use(express.json());

app.use("api/users", userRouter);
// app.use("api/tweets", tweetRouter);

module.exports = app;
