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

module.exports = { createUser };
