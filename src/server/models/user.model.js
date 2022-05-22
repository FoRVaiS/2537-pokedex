const { model, Schema } = require('mongoose');

const UserModel = model('user', new Schema({
  username: String,
  password: String,
  roles: [String],
}));

module.exports = { UserModel };
