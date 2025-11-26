const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Define environment variables with defaults
const env = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/andrejcoffeeshop',
  port: process.env.PORT || process.env.port || 3000,
};

// Export the environment variables
module.exports = env;

