const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const BookSchema = new mongoose.Schema({
    id: { // custom book ID
        type: String, // type is string
        required: [true, 'please supply the book ID'], // is required
        unique: true, // must be unique
        index: true, // is indexed for faster search
        // ID must start with 'b' followed by a number greater than 0
        match: [/^b[1-9]\d*$/, 'the book ID must start with "b" followed by a positive number'],
    },
    title: { // Book title
        type: String, // type is string
        required: [true, 'please supply the title'], // is required
        trim: true, // whitespaces should be trimmed
        minlength: [1, 'the title cannot be empty'], // minimum length 1
        maxlength: [150, 'the title cannot be more than 150 characters'], // maximum length 150
    },
    author: { // Book author name
        type: String, // type is string
        required: [true, 'please supply the author name'], // is required
        trim: true, // whitespaces should be trimmed
        minlength: [1, 'the author name cannot be empty'], // minimum length 1
        maxlength: [100, 'the author name cannot be more than 100 characters'], // maximum length 100
    },
    year: { // Publication year
        type: Number, // type is number
        required: [true, 'please supply the publication year'], // is required
        min: [1, 'the publication year must be a positive number'], // minimum year 1
        // Cannot be later than the current year
        max: [currentYear, `the publication year must not be later than ${currentYear}`],
    },
    genre: { // Book genre
        type: String, // type is string
        required: [true, 'please supply the genre'], // is required
        trim: true, // whitespaces should be trimmed
        minlength: [1, 'the genre must be at least 1 character long'], // minimum length 1
        maxlength: [50, 'the genre must be at most 50 characters long'], // maximum length 50
    },
    summary: { // Book summary
        type: String, // type is string
        required: [true, 'please supply the summary'], // is required
        trim: true, // whitespaces should be trimmed
        minlength: [10, 'the summary must be at least 10 characters long'], // minimum length 10
        maxlength: [1000, 'the summary must be at most 1000 characters long'], // maximum length 1000
    },
    price: { // Book price
        type: mongoose.Decimal128, // type is Decimal128 for precise monetary values
        required: [true, 'please supply the price'], // is required
        get: (value) => value ? value.toString() : value, // getter to convert Decimal128 to string
        set: (value) => { // setter to convert string/number to Decimal128
            if (value == null) return value; // handle null/undefined
            return mongoose.Types.Decimal128.fromString(value.toString()); // convert to Decimal128
        },
        validate: { // custom validator
            validator(value) {
                if (!value) return false; // null or undefined is invalid
                const strValue = value.toString();
                // regex to match positive numbers with up to two decimal places
                return /^\d+(\.\d{1,2})?$/.test(strValue) && parseFloat(strValue) > 0;
            },
            message: 'price must be a positive number with up to two decimal places',
        },
    },
}, {
    toJSON: {
        getters: true,
        virtuals: false,
        transform(_doc, ret) {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        getters: true,
        virtuals: false,
    },
});

module.exports = mongoose.model('Book', BookSchema);

