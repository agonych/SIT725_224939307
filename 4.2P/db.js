const mongoose = require('mongoose');
const { mongoUri } = require('./env');

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
    await mongoose.connect(mongoUri);

    return mongoose.connection;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
};

// Export the connectDB function
module.exports = { connectDB };