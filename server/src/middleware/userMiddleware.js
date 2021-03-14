const User = require("../models/user.model");

const findUser = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send();
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = { findUser };
