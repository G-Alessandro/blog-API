const express = require('express');

const router = express.Router();

const homepage_controller = require('../controllers/index');

router.get('/', homepage_controller.homepage_get);

router.get('/sign-in', homepage_controller.sign_in_get);

router.post('/sign-in', homepage_controller.sign_in_post);

router.get('/sign-up', homepage_controller.sign_up_get);

router.post('/sign-up', homepage_controller.sign_up_post);

// router.get('/logout', homepage_controller.logout_get);

router.get('/post/:postId', homepage_controller.blog_post_get);

router.post('/post/:postId', homepage_controller.blog_comment_post);

module.exports = router;
