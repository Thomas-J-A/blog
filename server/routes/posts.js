const express = require('express');
const passport = require('passport');
const postsController = require('../controllers/postsController');
const checkIsAdmin = require('../middleware/checkIsAdmin');

const router = express.Router();

// Protect endpoints in case state is changed on frontend, enabling
// access to protected pages, or a tool like Postman is used for requests
// router.method(path, authentication, authorization, controller)

// All access
router.get('/', postsController.readPosts);

// Admin-only access (authentication & authorization middlewares)
router.post('/', passport.authenticate('jwt', { session: false }), checkIsAdmin, postsController.createPost);

// All access
router.get('/:id', postsController.readPost);

// Admin-only access (authentication & authorization middlewares)
router.put('/:id', passport.authenticate('jwt', { session: false }), checkIsAdmin, postsController.updatePost);

// Admin-only access (authentication & authorization middlewares)
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkIsAdmin, postsController.deletePost);

module.exports = router;
