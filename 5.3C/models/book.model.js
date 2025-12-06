const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    summary: { type: String, required: true },
    price: {
        type: mongoose.Decimal128,
        required: true,
        get: (value) => value ? value.toString() : value,
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

