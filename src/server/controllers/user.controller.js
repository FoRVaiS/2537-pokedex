const { UserModel } = require('../models/user.model');

const createUser = async (req, res) => {
  const { username, password, age, gender, firstName, lastName } = req.body;

  const [existingUser] = await UserModel.find({ username: username.trim() });

  if (existingUser) return res.status(400).json({
    success: false,
    data: {
      msg: `The username ${existingUser.username} is already taken.`,
    },
  });

  try {
    await UserModel.create({
      username: username.trim(),
      password,
      age,
      gender,
      firstName,
      lastName,
      roles: ['member'],
    });

    return res.status(200).json({ success: true, data: null });
  } catch (e) {
    return res.status(500).json({ success: false, data: { msg: e.message } });
  }
};

const editUser = async (req, res) => {
  const { _id, username, password, firstName, lastName } = req.body;

  try {
    await UserModel.updateOne({ _id }, { username, password, firstName, lastName });
  } catch (e) {
    return res.status(500).json({
      success: false,
      data: {
        msg: e.message,
      },
    });
  }

  return res.status(500).json({
    success: true,
    data: null,
  });
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

const logout = async (req, res) => {
  req.session.isAuthenticated = false;
  req.session._id = null;

  res.status(200).json({
    success: true,
    data: null,
  });
};

module.exports = { createUser, editUser, login, logout };
