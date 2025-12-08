const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/bookCatalogue';

// Handle successful connection event
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});

// Handle connection error event
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

// Initialize the MongoDB connection
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        // Connection already established.
        return mongoose.connection;
    }

    try {
        await mongoose.connect(MONGO_URI);

        return mongoose.connection;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err;
    }
};

// Export helpers required by the rest of the app
module.exports = {
    connectDB,
    mongoose,
};