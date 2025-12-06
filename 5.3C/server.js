const express = require('express');
const path = require('path');
const apiRoutes = require('./routes');
const { connectDB } = require('./libs/db');
const PORT = 3000;

// Setup the express
const app = express();
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies

// Use API routes
app.use('/api', apiRoutes);

// Handle 404 error
app.use((req, res, _next) => {
    return res.status(404).json({ message: 'Endpoint not found.' });
});

// Init the app
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
