const { EventModel } = require("../models/event.model");

// TODO: Perform error handling

const captureEvent = async (req, res) => {
  const { name, data } = req.body;

  await incrementEventCount(name, data);

  res.status(200).json({ success: true, data: req.body });
};

const incrementEventCount = async (eventName, data) => {
  const [event] = await EventModel.find({ name: eventName, data });

  if (!event) {
    await EventModel.create({
      name: eventName,
      count: 1,
      lastUpdated: (new Date()).getTime(),
      data,
    });
  } else {
    await EventModel.updateOne({
      name: eventName,
      data
    }, {
      $inc: { count: 1 },
      $set: { lastUpdated: (new Date()).getTime() },
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

  const [event] = await EventModel.find({ name, data: req.query }, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: event,
  });
}

module.exports = { captureEvent, incrementEventCount, fetchEvents, fetchEvent };
