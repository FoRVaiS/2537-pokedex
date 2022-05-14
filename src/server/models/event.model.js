const { model, Schema } = require('mongoose');

const EventModel = model('event', new Schema({
  name: String,
  count: Number,
  lastUpdated: Number,
  data: Object,
}));

module.exports = { EventModel };
