const { EventModel } = require("../models/event.model");

// TODO: Perform error handling

const captureEvent = async (req, res) => {
  const { name } = req.body;

  await incrementEventCount(name);

  res.status(200).json({ success: true, data: req.body });
};

const incrementEventCount = async eventName => {
  const [data] = await EventModel.find({ name: eventName });

  if (!data) {
    await EventModel.create({
      name: eventName,
      type: 'counter',
      count: 1,
    });
  } else {
    await EventModel.updateOne({
      name: eventName,
    }, {
      $inc: { count: 1 },
    });
  }
};

module.exports = { captureEvent, incrementEventCount };
