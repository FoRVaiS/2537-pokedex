const { model, Schema } = require('mongoose');

const UserModel = model('user', new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  isRemovable: { type: Boolean, default: false },
  activeCart: { type: Number, default: -1 },
  roles: [String],
}));

module.exports = { UserModel };
