const { model, Schema, Types } = require('mongoose');

const EventModel = model('event', new Schema({
  userId: Types.ObjectId,
  name: String,
  count: Number,
  lastUpdated: Number,
  data: Object,
}));

module.exports = { EventModel };
