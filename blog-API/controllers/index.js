const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { format } = require('date-fns');
const he = require('he');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
require('dotenv').config();

exports.homepage_get = asyncHandler(async (req, res) => {
  const allPosts = await Post.find({ isPublished: true }).sort({ timestamp: -1 });
  const formattedPost = allPosts.map((post) => ({
    ...post.toObject(),
    timestamp: format(new Date(post.timestamp), 'EEEE dd MMMM yyyy'),
    text: he.decode(post.text),
  }));
  if (!allPosts) {
    res.status(204).json();
  } else {
    res.status(200).json(formattedPost);
  }
});

exports.sign_up_get = asyncHandler(async (req, res) => {
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

  asyncHandler(async (req, res) => {
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

exports.sign_in_get = asyncHandler(async (req, res) => {
  res.status(200).json();
});

exports.sign_in_post = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Auth Failed' });
  }

  try {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = generateToken(user);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ message: 'Auth Failed' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

exports.post_get = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({ timestamp: -1 });

  const formattedComments = comments.map((comment) => ({
    ...comment.toObject(),
    timestamp: format(new Date(comment.timestamp), 'EEEE dd MMMM yyyy HH:mm'),
    text: he.decode(comment.text),
  }));
  res.status(200).json({ formattedComments });
});

exports.post_comment_post = [
  body('comment', 'Comment must not be empty.').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      res.json({ error: errorsMessages });
    } else {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = verifyToken(token);
        const tokenUsername = decodedToken.username;

        const newComment = new Comment({
          postId: req.params.postId,
          username: tokenUsername,
          text: req.body.comment,
          timestamp: new Date(),
        });

        await newComment.save();

        const comments = await Comment.find({ postId: req.params.postId }).sort({ timestamp: -1 });
        const formattedComments = comments.map((comment) => ({
          ...comment.toObject(),
          timestamp: format(new Date(comment.timestamp), 'EEEE dd MMMM yyyy HH:mm'),
          text: he.decode(comment.text),
        }));

        return res.status(201).json({ formattedComments });
      } catch (error) {
        console.log('An error occurred while processing the request:', error);
        res.status(500).send('An error occurred while processing the request.');
      }
    }
  }),
];
