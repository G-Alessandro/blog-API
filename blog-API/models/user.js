const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String, minLength: 1, maxLength: 30, required: true,
  },
  password: {
    type: String, minLength: 8, maxLength: 16, required: true,
  },
  isAuthor: { type: Boolean },
});

module.exports = mongoose.model('User', UserSchema);
