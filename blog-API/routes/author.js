const express = require('express');

const router = express.Router();

const author_controller = require('../controllers/author');

router.get('/sign-in', author_controller.author_sign_in_get);

router.post('/sign-in', author_controller.author_sign_in_post);

router.get('/author-dashboard', author_controller.author_dashboard_get);

router.get('/add-post', author_controller.add_post_get);

router.post('/add-post', author_controller.add_post_post);

router.put('/change-publication/:postId', author_controller.post_put);

router.delete('/delete-post/:postId', author_controller.post_delete);
