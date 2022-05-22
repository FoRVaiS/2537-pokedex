const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CartSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  pokemon: Array,
});
// eslint-disable-next-line camelcase
CartSchema.plugin(AutoIncrement, { inc_field: 'cartId' });

const CartModel = mongoose.model('cart', CartSchema);


module.exports = { CartModel };
