const { BookService } = require('../services');

// Define allowed fields for book operations
const ALLOWED_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];

// Utility function to pluralise words based on list length
const pluralise = (listValue) => {
    return listValue.length === 1 ? '' : 's';
}

// Utility function to get unknown fields from payload
const detectUnknownFields = (payload) => {
    // Identify fields in payload that are not in ALLOWED_FIELDS
    const unknownFields = Object.keys(payload || {}).filter((key) => !ALLOWED_FIELDS.includes(key));
    // Return appropriate error message if any unknown fields are detected
    if (unknownFields.length > 0) {
        return `Unknown field${pluralise(unknownFields)} detected in the request body: ${unknownFields.join(', ')}`;
    }
    return null;
}


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
            ? `${books.length} book${pluralise(books)} found`
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

// Create a new book
exports.createBook = async (req, res) => {
    try {

        const body = req.body || {};

        // Check for unknown fields in the request body
        const unknownFieldsError = detectUnknownFields(body);
        if (unknownFieldsError) {

            // 400 Bad Request – unknown fields present
            return res.status(400).json({
                status: 400,
                message: unknownFieldsError
            });
        }

        const createdBook = await BookService.createBook(body);

        // Return 201 Created with the created book details
        return res.status(201).json({
            status: 201,
            data: createdBook,
            message: 'Book created successfully',
        });
    } catch (error) { // Handle errors appropriately

        // 400 Bad Request – schema validation failed
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                status: 400,
                message: 'Validation failed',
                errors,
            });
        }

        // 409 Conflict – duplicate key (e.g. id already exists)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.id) {
            return res.status(409).json({
                status: 409,
                message: `Book with id '${error.keyValue.id}' already exists`,
            });
        }

        // 500 Internal Server Error – other errors
        console.error('Failed to create book:', error);
        return res.status(500).json({
            status: 500,
            message: 'Failed to create book',
        });
    }
};

// Update book details by ID
exports.updateBook = async (req, res) => {
    try {
        // Load book ID from URL params and updates from request body
        const bookId = req.params.id;
        const body = req.body || {};

        const unknownFieldsError = detectUnknownFields(body);
        if (unknownFieldsError) {
            return res.status(400).json({
                status: 400,
                message: unknownFieldsError
            });
        }

        // Call service to update the book (all validations are handled there)
        const updatedBook = await BookService.updateBook(bookId, body);

        // If no book found with the given ID, return 404 Not Found
        if (!updatedBook) {
            return res.status(404).json({
                status: 404,
                message: 'Book not found',
            });
        }

        // Return 200 OK with the updated book details
        return res.json({
            status: 200,
            data: updatedBook,
            message: 'Book updated successfully',
        });
    } catch (error) { // Handle errors appropriately

        // 400 Bad Request – validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                status: 400,
                message: 'Validation failed',
                errors,
            });
        }

        // 500 Internal Server Error – other errors
        console.error('Failed to update book:', error);
        return res.status(500).json({
            status: 500,
            message: 'Failed to update book',
        });
    }
};

// Delete book by ID
exports.deleteBook = async (req, res) => {
    try {
        // Load book ID from URL params
        const bookId = req.params.id;

        // Call service to delete the book
        const deleted = await BookService.deleteBook(bookId);

        // If no book found with the given ID, return 404 Not Found
        if (!deleted) {
            return res.status(404).json({
                status: 404,
                message: 'Book not found',
            });
        }

        // Return 200 OK on successful deletion
        return res.status(200).json({
            status: 200,
            message: 'Book deleted successfully',
        });
    } catch (error) { // Handle errors

        // 500 Internal Server Error – other errors
        console.error('Failed to delete book:', error);
        return res.status(500).json({
            status: 500,
            message: 'Failed to delete book',
        });
    }
};