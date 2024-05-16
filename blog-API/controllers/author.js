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
      const token = generateToken(user);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ message: 'Auth Failed' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

exports.author_dashboard_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({ timestamp: -1 });
  const formattedPost = posts.map((post) => ({
    ...post.toObject(),
    timestamp: format(new Date(post.timestamp), 'EEEE dd MMMM yyyy'),
    text: he.encode(post.text),
  }));
  if (!posts) {
    res.status(204).json('No posts found!');
  } else {
    res.status(200).json(formattedPost);
  }
});

exports.add_post_get = asyncHandler(async (req, res, next) => {
  res.status(200).json();
});

exports.add_post_post = [
  body('title', 'title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('content', 'text must not be empty.').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      res.json({ error: errorsMessages });
    } else {
      const decoded = verifyToken(req.headers.authorization.split(' ')[1]);
      try {
        const post = new Post({
          title: he.decode(req.body.title),
          username: decoded.username,
          text: he.decode(req.body.content),
          timestamp: new Date(),
          isPublished: false,
        });

        await post.save();
        res.status(201).json('Post created successfully');
      } catch (error) {
        res.status(500).json('An error occurred while processing the request.');
      }
    }
  }),
];

exports.post_put = [
  body('isPublished').isBoolean(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map((error) => error.msg);
      res.json({ error: errorsMessages });
    } else {
      try {
        const decoded = verifyToken(req.headers.authorization.split(' ')[1]);
        await Post.findByIdAndUpdate(req.params.postId, { isPublished: req.body.isPublished });
        res.status(200).json('Post publication changed!');
      } catch (error) {
        console.log(error('Error requesting:', error));
        res.status(401).json('Error requesting');
      }
    }
  }),
];

// Edit comment Delete comment

// exports.comment_put = asyncHandler(async (req, res, next) => {
//   await Comment.findById(req.query.id, { isPublished: !true });
//   res.redirect('/author-dashboard');
// });

// exports.comment_delete = asyncHandler(async (req, res, next) => {
//   await Comment.findByIdAndDelete(req.query.id);
//   res.redirect('/author-dashboard');
// });
