const { UserModel } = require('../models/user.model');

const requireRoles = (...roles) => async (req, res, next) => {
  if (req.session.isAuthenticated) {
    const [user] = await UserModel.find({ _id: req.session._id });

    let hasRole = false;

    user.roles.forEach(role => {
      if (!hasRole && roles.includes(role)) {
        hasRole = true;
        // eslint-disable-next-line node/callback-return
        next();
      }
    });
  } else {
    res.status(400).json({
      success: false,
      data: {
        msg: 'User is missing the correct privileges to access this resource.',
      },
    });
  }

  return null;
};

module.exports = { requireRoles };
