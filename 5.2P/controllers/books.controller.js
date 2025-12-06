const { BookService } = require('../services');

// Get all books with optional filters: genre, year, author
exports.getAllBooks = (req, res) => {
    const { genre, year, author } = req.query;
    const books = BookService.getAllBooks(genre, year, author);

    if (books.length === 0) {
        return res.status(404).json({
            status: 404,
            message: 'No books found',
        });
    }

    const message = (genre || year || author)
        ? `${books.length} book(s) found`
        : 'Book catalog retrieved successfully';

    res.json({
        status: 200,
        data: books,
        message: message,
    });
};

// Get book details by ID
exports.getBookById = (req, res) => {
    const bookId = req.params.id;
    const book = BookService.getBookById(bookId);

    if (book) {
        res.json({
            status: 200,
            data: book,
            message: 'Book details retrieved successfully',
        });
    } else {
        res.status(404).json({
            status: 404,
            message: 'Book not found',
        });
    }
};