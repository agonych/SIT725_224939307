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

// Handle malformed JSON payloads explicitly
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid JSON payload supplied',
            details: error.message,
        });
    }
    return next(error);
});

// Use API routes
app.use('/api', apiRoutes);

// Handle 404 error
app.use((req, res, _next) => {
    return res.status(404).json({ message: 'Endpoint not found.' });
});

// Fallback error handler to keep responses consistent
app.use((error, _req, res, _next) => {
    console.error('Unhandled error:', error);
    if (res.headersSent) {
        return;
    }
    const status = error.status || 500;
    res.status(status).json({
        status,
        message: status === 500 ? 'Internal server error' : error.message,
    });
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
