const requireAuth = () => (req, res, next) => {
  if (req.session.isAuthenticated) return next();

  return res.status(400).json({
    success: false,
    data: {
      msg: 'User is required to be authenticated to access this resource.',
    },
  });
};

module.exports = { requireAuth };
