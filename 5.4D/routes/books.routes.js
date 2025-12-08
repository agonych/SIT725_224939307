const express = require('express');
const router = express.Router();
const { bookController } = require('../controllers');

// Define routes for books
router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Export the router
module.exports = router;