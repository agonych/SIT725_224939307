const { BookService } = require('../services');

// Get all books with optional filters: genre, year, author
exports.getAllBooks = async (req, res) => {
    try {
        const { genre, year, author } = req.query;
        const books = await BookService.getAllBooks(genre, year, author);

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
    } catch (error) {
        console.error('Failed to fetch books:', error);
        res.status(500).json({
            status: 500,
            message: 'Failed to retrieve books',
        });
    }
};

// Get book details by ID
exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await BookService.getBookById(bookId);

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
    } catch (error) {
        console.error('Failed to fetch book by ID:', error);
        res.status(500).json({
            status: 500,
            message: 'Failed to retrieve book details',
        });
    }
};