const express = require('express');

const router = express.Router();

const index_controller = require('../controllers/index');

router.get('/', index_controller.homepage_get);

router.get('/sign-in', index_controller.sign_in_get);

router.post('/sign-in', index_controller.sign_in_post);

router.get('/sign-up', index_controller.sign_up_get);

router.post('/sign-up', index_controller.sign_up_post);

router.get('/post/:postId', index_controller.blog_post_get);

router.post('/post/:postId', index_controller.blog_comment_post);

module.exports = router;
