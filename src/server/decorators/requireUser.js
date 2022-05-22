const requireUser = id => (req, res, next) => {
  if (req.session._id === id) return next();

  return res.status(403).json({
    success: false,
    data: {
      msg: 'User is forbidden from accessing personal resources other than their own.',
    },
  });
};

module.exports = { requireUser };
