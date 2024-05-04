const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const he = require('he');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
require('dotenv').config();

exports.author_sign_in_get = asyncHandler(async (req, res, next) => {
  res.status(200).json();
});

exports.author_sign_in_post = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Auth Failed' });
  }

  if (!user.isAuthor) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const opts = { expiresIn: 3600 };
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ username }, secret, opts);

      return res.status(200).json({
        message: 'Auth Passed',
        token,
      });
    }
    res.redirect('/author-dashboard');
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

exports.author_dashboard_get = asyncHandler(async (req, res, next) => {
  const authorPost = await Post.find().sort({ timestamp: -1 });
  res.status(200).json({ authorPost });
});

exports.add_post_get = asyncHandler(async (req, res, next) => {
  res.status(200).json();
});

exports.add_post_post = [
  body('title', 'title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('text', 'text must not be empty.').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      res.json({ error: errorsMessages });
    } else {
      try {
        const post = new Post({
          title: he.decode(req.body.title),
          username: req.user.username,
          text: he.decode(req.body.text),
          timestamp: new Date(),
          isPublished: false,
        });

        await post.save();
        res.redirect('/');
      } catch (error) {
        res.status(500).send('An error occurred while processing the request.');
      }
    }
  }),
];

exports.post_put = asyncHandler(async (req, res, next) => {
  await Post.findByIdAndUpdate(req.query.id, { isPublished: !true });
  res.redirect('/author-dashboard');
});

exports.post_delete = asyncHandler(async (req, res, next) => {
  await Post.findByIdAndDelete(req.query.id);
  res.redirect('/author-dashboard');
});

// Edit comment Delete comment

// exports.comment_put = asyncHandler(async (req, res, next) => {
//   await Comment.findById(req.query.id, { isPublished: !true });
//   res.redirect('/author-dashboard');
// });

// exports.comment_delete = asyncHandler(async (req, res, next) => {
//   await Comment.findByIdAndDelete(req.query.id);
//   res.redirect('/author-dashboard');
// });
