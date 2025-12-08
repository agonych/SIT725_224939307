const express = require('express');
const router = express.Router();

const bookRoutes = require('./books.routes');

router.use('/books', bookRoutes);

module.exports = router;