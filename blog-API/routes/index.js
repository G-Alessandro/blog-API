const express = require('express');

const router = express.Router();

const homepage_controller = require('../controller/index');

router.get('/', homepage_controller.homepage_get);

router.get('/sign_in', homepage_controller.sign_in_get);

router.post('/sign_in', homepage_controller.sign_in_post);

router.get('/sign-up', homepage_controller.sign_up_get);

router.post('/sign-up', homepage_controller.sign_up_post);

router.get('/logout', homepage_controller.logout_get);

router.get('/post/:postId', homepage_controller.blog_post_get);

module.exports = router;
