const { Book } = require('../models');

// Utility function to escape special regex characters
const escapeRegex = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get all books with optional filters: genre, year, author
exports.getAllBooks = async (genre = null, year = null, author = null) => {
    const query = {};

    if (genre) {
        query.genre = new RegExp(`^${escapeRegex(genre)}$`, 'i');
    }

    if (year) {
        const parsedYear = parseInt(year, 10);
        if (!Number.isNaN(parsedYear)) {
            query.year = parsedYear;
        }
    }

    if (author) {
        query.author = new RegExp(escapeRegex(author), 'i');
    }

    const books = await Book.find(query).exec();
    return books.map((book) => book.toJSON());
};

// Get book details by ID
exports.getBookById = async (id) => {
    const book = await Book.findOne({ id }).exec();
    return book ? book.toJSON() : null;
};
