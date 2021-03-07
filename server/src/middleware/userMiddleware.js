const findUser = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).send();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { findUser };
