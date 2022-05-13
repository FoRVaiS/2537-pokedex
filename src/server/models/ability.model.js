const { model, Schema } = require('mongoose');

const AbilityModel = model('ability', new Schema({
  name: String,
  id: Number,
}));

module.exports = { AbilityModel };
