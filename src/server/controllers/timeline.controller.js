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

const fetchEvents = async (req, res) => {
  const data = await EventModel.find({}, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: {
      results: data
    },
  });
};

const fetchEvent = async (req, res) => {
  const { name } = req.params;

  const [data] = await EventModel.find({ name }, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data,
  });
}

module.exports = { captureEvent, incrementEventCount, fetchEvents, fetchEvent };
