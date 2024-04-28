const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, minLength: 1, required: true },
  username: {
    type: String,
  },
  text: {
    type: String, minLength: 1, required: true,
  },
  timestamp: {
    type: Date,
  },
  isPublished: { type: Boolean },
});

module.exports = mongoose.model('Post', PostSchema);
