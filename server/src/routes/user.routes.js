const express = require("express");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const userMiddleware = require("../middleware/userMiddleware");
const userController = require("../controllers/user.controller");

const userRouter = new express.Router();

// GET my profile
userRouter.get("/me", auth, userController.getProfile);

userRouter.get(["/:username", "/:username/*"], userMiddleware.findUser);

// GET profile from selected user
userRouter.get("/:username", userController.getProfile);

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
userRouter.get("/:username/tweets", userController.getUserTweets);

// POST sign up to service
userRouter.post("/signup", userController.signUpUser);

// POST log in to service
userRouter.post("/login", userController.logInUser);

// POST log out of service
userRouter.post("/logout", auth, userController.logOutUser);

// POST log out of all sessions
userRouter.post("/logoutAll", auth, userController.logOutOfAllSessions);

// POST follow selected user
userRouter.post("/:username/follow", auth, userController.followUser);

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

// DELETE following of selected user
userRouter.delete("/:username/follow", auth, userController.deleteFollow);

module.exports = userRouter;
