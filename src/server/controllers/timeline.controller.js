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
      // Force all values to be strings so they can be queried by req.query later on.
      // Clients will be returned the incorrect value types but they should type check anyways.
      data: Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, value.toString()]))),
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

  const findQuery = Object.keys(req.query).length
    ? { name, data: req.query }
    : { name };

  const [event] = await EventModel.find(findQuery, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: event,
  });
}

module.exports = { captureEvent, incrementEventCount, fetchEvents, fetchEvent };
