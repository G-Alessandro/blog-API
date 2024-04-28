const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const he = require('he');
const bcrypt = require('bcryptjs');
const passport = require('../user-authentication/passport-config');
const Post = require('../models/post');
const User = require('../models/user');

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
      res.json({ errorsMessages });
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

exports.sign_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/error',
});

exports.logout_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

exports.blog_post_get = asyncHandler(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.query.id });
  const comments = await Comment.find({ postId: req.query.id }).sort({ timestamp: -1 });
  res.json({ post, comments });
});