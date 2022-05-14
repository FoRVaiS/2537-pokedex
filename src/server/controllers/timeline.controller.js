const captureEvent = (req, res) => {
  const { name } = req.body;

  res.status(200).json({ success: true, data: req.body });
};

module.exports = { captureEvent };
