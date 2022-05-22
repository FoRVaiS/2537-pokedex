const { UserModel } = require('../models/user.model');

const createUser = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password.toLowerCase();

  const [existingUser] = await UserModel.find({ username });

  if (existingUser) return res.status(400).json({
    success: false,
    data: {
      msg: `The username ${existingUser.username} is already taken.`,
    },
  });

  try {
    await UserModel.create({ username, password });

    return res.status(200).json({ success: true, data: null });
  } catch (e) {
    return res.status(500).json({ success: false, data: { msg: e.message } });
  }
};

const login = async (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  const [user] = await UserModel.find({ username }, { __id: 0, _v: 0 });

  if (user && user.password === password) {
    req.session.isAuthenticated = true;
    req.session._id = user._id;

    return res.status(200).json({
      success: true,
      data: user,
    });
  }

  return res.status(400).json({
    success: false,
    data: {
      msg: 'Account could not be found or does not exist.',
    },
  });
};

module.exports = { createUser, login };
