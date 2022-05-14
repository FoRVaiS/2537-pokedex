const { model, Schema } = require('mongoose');

const EventModel = model('event', new Schema({
  name: String,
  count: Number,
}));

module.exports = { EventModel };
