const express = require('express');
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router.post('/', commentsController.createComment);

router.delete('/:id', commentsController.deleteComment);

module.exports = router;
