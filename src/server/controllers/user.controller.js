const { UserModel } = require('../models/user.model');

const createUser = async (req, res) => {
  const { username, password } = req.body;

  const [existingUser] = await UserModel.find({ username: username.trim() });

  if (existingUser) return res.status(400).json({
    success: false,
    data: {
      msg: `The username ${existingUser.username} is already taken.`,
    },
  });

  try {
    await UserModel.create({ username, password, roles: ['member'] });

    return res.status(200).json({ success: true, data: null });
  } catch (e) {
    return res.status(500).json({ success: false, data: { msg: e.message } });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const [user] = await UserModel.find({ username: username.trim() }, { __id: 0, _v: 0 });

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
