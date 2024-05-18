const express = require('express');

const router = express.Router();

const author_controller = require('../controllers/author');

router.get('/sign-in', author_controller.author_sign_in_get);

router.post('/sign-in', author_controller.author_sign_in_post);

router.get('/dashboard', author_controller.author_dashboard_get);

router.get('/new-post', author_controller.new_post_get);

router.post('/new-post', author_controller.new_post_post);

router.put('/dashboard/:postId', author_controller.post_put);

router.put('/post/comment/:commentId', author_controller.comment_put);

router.delete('/post/comment/:commentId', author_controller.comment_delete);

module.exports = router;
