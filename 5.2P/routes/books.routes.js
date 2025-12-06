const express = require('express');
const router = express.Router();
const { bookController } = require('../controllers');

// Define routes for books
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Export the router
module.exports = router;