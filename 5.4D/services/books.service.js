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

// Create a new book
exports.createBook = async (payload) => {
    const book = new Book(payload);
    const saved = await book.save(); // Triggers schema validation automatically
    return saved.toJSON();
};

// Update an existing book by ID
exports.updateBook = async (id, updates) => {
    // ensure the ID is not attempted to be changed
    const { id: bodyId, ...safeUpdates } = updates;

    const updated = await Book.findOneAndUpdate(
        { id }, // find book by given ID
        safeUpdates, // supply all fields to update
        {
            runValidators: true, // run schema validators on updates
            new: true, // return updated document
        }
    ).exec();

    return updated ? updated.toJSON() : null;
};

// Delete a book by ID
exports.deleteBook = async (id) => {
    const result = await Book.deleteOne({ id }).exec();
    return result.deletedCount > 0;
};