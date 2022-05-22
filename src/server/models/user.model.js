const { model, Schema } = require('mongoose');

const UserModel = model('user', new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  activeCart: { type: Number, default: -1 },
  roles: [String],
}));

module.exports = { UserModel };
