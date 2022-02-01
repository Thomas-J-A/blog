const express = require('express');
const passport = require('passport');
const commentsController = require('../controllers/commentsController');
const checkIsAdmin = require('../middleware/checkIsAdmin');

const router = express.Router();

// Logged-in user access (authentication middleware)
router.post('/', passport.authenticate('jwt', { session: false }), commentsController.createComment);

// Admin-only access (authentication & authorization middlewares)
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkIsAdmin, commentsController.deleteComment);

module.exports = router;
