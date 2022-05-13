const { model, Schema } = require('mongoose');

const PokemonModel = model('pokemon', new Schema({
  name: String,
  id: Number,
}));

module.exports = { PokemonModel };
