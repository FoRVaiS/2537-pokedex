const { EventModel } = require('../models/event.model');

// TODO: Perform error handling

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
      data,
    }, {
      $inc: { count: 1 },
      $set: { lastUpdated: (new Date()).getTime() },
    });
  }
};

const captureEvent = async (req, res) => {
  const { name, data } = req.body;

  // Force all values to be strings so they can be queried by req.query later on.
  // Clients will be returned the incorrect value types but they should type check anyways.
  await incrementEventCount(name, Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, value.toString()]))));

  res.status(200).json({ success: true, data: req.body });
};

const fetchEvents = async (req, res) => {
  const data = await EventModel.find({}, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: {
      results: data,
    },
  });
};

const fetchEvent = async (req, res) => {
  const { name } = req.params;

  const findQuery = Object.keys(req.query).length
    ? { name, data: req.query }
    : { name };

  const event = await EventModel.find(findQuery, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: event,
  });
};

const deleteEvent = async (req, res) => {
  const { name, data } = req.body;

  await EventModel.deleteOne({ name, data: Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, value.toString()]))) });

  res.status(200).json({
    success: true,
    data: null,
  });
};

module.exports = { captureEvent, incrementEventCount, fetchEvents, fetchEvent, deleteEvent };
