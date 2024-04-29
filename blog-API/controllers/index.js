const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { format } = require('date-fns');
const he = require('he');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
require('dotenv').config();

exports.homepage_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find().sort({ timestamp: -1 });
  if (!allPosts) {
    res.status(200).json();
  } else {
    res.status(200).json(allPosts);
  }
});

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.status(200).json();
});

exports.sign_up_post = [

  body('username', 'Username must not be empty.').trim().isLength({ min: 1, max: 30 }).escape()
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error('User already exists.');
      }
    }),
  body('password', 'Password must not be empty.').trim().isLength({ min: 8, max: 16 }).escape(),
  body('confirm-password', 'Confirm Password must not be empty.').custom((value, { req }) => value === req.body.password)
    .withMessage('Password does not match.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      res.json({ error: errorsMessages });
    } else {
      try {
        const user = new User({
          username: he.decode(req.body.username),
          password: he.decode(req.body.password),
          isAuthor: false,
        });

        user.password = await bcrypt.hash(user.password, 10);

        await user.save();
        res.redirect('/sign-in');
      } catch (error) {
        res.status(500).send('An error occurred while processing the request.');
      }
    }
  }),
];

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.status(200).json();
});

exports.sign_in_post = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Auth Failed' });
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
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// exports.logout_get = asyncHandler(async (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     res.redirect('/');
//   });
// });

exports.blog_post_get = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.query.id });
  const comments = await Comment.find({ postId: req.query.id }).sort({ timestamp: -1 });
  const formattedComments = comments.map((comment) => ({
    ...comment.toObject(),
    timestamp: format(new Date(comment.timestamp), 'EEEE dd MMMM yyyy HH:mm'),
  }));
  res.json({ post, formattedComments });
});

exports.blog_comment_post = [
  body('comment', 'Comment must not be empty.').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      res.json({ error: errorsMessages });
    } else {
      try {
        const comment = new Comment({
          postId: req.query.id,
          username: req.user.username,
          text: req.body.comment,
          timestamp: new Date(),
        });
        await comment.save();
        res.redirect(`/post/${req.query.id}`);
      } catch (error) {
        console.log('An error occurred while processing the request:', error);
        res.status(500).send('An error occurred while processing the request.');
      }
    }
  }),
];
