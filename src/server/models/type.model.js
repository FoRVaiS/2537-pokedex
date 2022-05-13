const { model, Schema } = require('mongoose');

const TypeModel = model('type', new Schema({
  name: String,
  id: Number,
}));

module.exports = { TypeModel };
