const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { format } = require('date-fns');
// const he = require('he');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
require('dotenv').config();

exports.homepage_get = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({ isPublished: true }).sort({ timestamp: -1 });
  const formattedPost = allPosts.map((post) => ({
    ...post.toObject(),
    timestamp: format(new Date(post.timestamp), 'EEEE dd MMMM yyyy'),
  }));
  if (!allPosts) {
    res.status(204).json();
  } else {
    res.status(200).json(formattedPost);
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
          username: req.body.username,
          password: req.body.password,
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

  console.log('Step 1: Received username and password');

  const user = await User.findOne({ username });

  if (!user) {
    console.log('Step 2: User not found');
    return res.status(401).json({ message: 'Auth Failed' });
  }

  console.log('Step 3: User found');

  try {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      console.log('Step 4: Passwords match');

      const opts = { expiresIn: '1h' };
      const secret = process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ id: user._id, username: user.username }, secret, opts);

      console.log('Step 5: Token generated and stored in localStorage');

      return res.status(200).json({ token });
    }
    console.log('Step 6: Passwords do not match');
    return res.status(401).json({ message: 'Auth Failed' });
  } catch (error) {
    console.error('Step 7: Internal Server Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

exports.blog_post_get = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ timestamp: -1 });

  const formattedComments = comments.map((comment) => ({
    ...comment.toObject(),
    timestamp: format(new Date(comment.timestamp), 'EEEE dd MMMM yyyy HH:mm'),
  }));
  res.json({ formattedComments });
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
