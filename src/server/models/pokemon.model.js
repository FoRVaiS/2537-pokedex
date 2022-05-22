const { model, Schema } = require('mongoose');

const PokemonModel = model('pokemon', new Schema({
  name: String,
  id: Number,
  sprites: Object,
  stats: Array,
}));

module.exports = { PokemonModel };
