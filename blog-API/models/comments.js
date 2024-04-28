const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  postId: {
    type: Schema.Types.Mixed,
  },
  userId: {
    type: Schema.Types.Mixed,
  },
  username: {
    type: String,
  },
  text: {
    type: String, minLength: 1, required: true,
  },
  timestamp: {
    type: Date,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
