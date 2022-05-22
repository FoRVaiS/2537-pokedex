const { EventModel } = require('../models/event.model');

// TODO: Perform error handling

const incrementEventCount = async (userId, eventName, data) => {
  const [event] = await EventModel.find({ userId, name: eventName, data });

  if (!event) {
    await EventModel.create({
      userId,
      name: eventName,
      count: 1,
      lastUpdated: (new Date()).getTime(),
      data,
    });
  } else {
    await EventModel.updateOne({
      userId,
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
  const { _id } = req.session;

  // Force all values to be strings so they can be queried by req.query later on.
  // Clients will be returned the incorrect value types but they should type check anyways.
  await incrementEventCount(_id, name, Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, value.toString()]))));

  res.status(200).json({ success: true, data: req.body });
};

const fetchEvents = async (req, res) => {
  const { _id } = req.session;

  const data = await EventModel.find({ userId: _id }, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: {
      results: data,
    },
  });
};

const fetchEvent = async (req, res) => {
  const { name } = req.params;
  const { _id } = req.session;

  const findQuery = Object.keys(req.query).length
    ? { userId: _id, name, data: req.query }
    : { userId: _id, name };

  const event = await EventModel.find(findQuery, { _id: 0, __v: 0 });

  res.status(200).json({
    success: true,
    data: event,
  });
};

const deleteEvent = async (req, res) => {
  const { name, data } = req.body;
  const { _id } = req.session;

  await EventModel.deleteOne({ userId: _id, name, data: Object.fromEntries(Object.entries(data).map(([key, value]) => ([key, value.toString()]))) });

  res.status(200).json({
    success: true,
    data: null,
  });
};

module.exports = { captureEvent, incrementEventCount, fetchEvents, fetchEvent, deleteEvent };
