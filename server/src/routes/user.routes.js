const express = require("express");

const auth = require("../middleware/auth");
const { findUser } = require("../middleware/userMiddleware");
const userController = require("../controllers/user.controller");

const userRouter = new express.Router();

// GET public information from authenticated user
userRouter.get("/me", auth, userController.getUserInformation);

// Use findUser middleware on all GET '/:username/*'
userRouter.get("/:username/*", findUser);

// GET public information from selected user
userRouter.get("/:username", userController.getUserInformation);

// GET avatar from selected user
userRouter.get("/:username/avatar", userController.getUserAvatar);

// GET followers from selected user
// GET /api/users/:username/followers?limit=10&skip=30
userRouter.get("/:username/followers", userController.getUserFollowers);

// GET followees from selected user
// GET /api/users/:username/followees?limit=10&skip=30
userRouter.get("/:username/followees", userController.getUserFollowees);

// GET tweet by its author
// GET /api/users/:username/tweets?limit=10&skip=30
tweetRouter.get("/:username/tweets", userController.getUserTweets);

// POST sign up to service
userRouter.post("/signup", userController.signUpUser);

// POST log in to service
userRouter.post("/login", userController.logInUser);

// POST log out of service
userRouter.post("/logout", auth, userController.logOutUser);

// POST log out of all sessions
userRouter.post("/logoutAll", auth, userController.logOutOfAllSessions);

// PUT new avatar to my profile
userRouter.put(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  userController.putUserAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// PUT new cover to my profile
userRouter.put(
  "/me/cover",
  auth,
  upload.single("cover"),
  userController.putUserCover,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// PATCH user information
// PATCH /api/users/me?name=Elon+Musk
userRouter.patch("/me", auth, userController.updateUserProfile);

// DELETE user
userRouter.delete("/me", auth, userController.deleteUser);

// DELETE user's avatar
userRouter.delete("/me/avatar", auth, userController.deleteUserAvatar);

// DELETE user's cover
userRouter.delete("/me/cover", auth, userController.deleteUserCover);

module.exports = userRouter;
