const express = require("express")
const { connectDB } = require("./db");
const { Product } = require("./models");
const { port } = require("./env");
const app = express()

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*********** API Endpoints ***********/

// GET /api/menu - retrieve coffee menu items
app.get("/api/menu", async (req, res, next) => {
    try {
        const products = await Product.find({}).lean();
        res.json({ items: products });
    } catch (err) {
        next(err);
    }
});

// POST /api/orders - place a new coffee order
app.post("/api/orders", (req, res) => {
    const order = req.body || {};

    console.log("New coffee order received:", order);

    res.status(201).json({
        message: "Order received. We'll get brewing shortly!"
    });
});

// Root endpoint
app.get("/api/", (req, res) => {
    res.json({
        message: "Coffee Shop API",
        endpoints: [
            "GET /api/menu",
            "POST /api/orders  (JSON: { customerName: <string>, items: [<coffeeId>, ...] })"
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);               // log for debugging
    if (res.headersSent) return next(err); // if headers already sent, delegate to Express
    res.status(500).json({ error: 'Internal server error.' });
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'This endpoint does not exists.' });
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log("App listening to: " + port)
        });
    } catch (err) {
        console.error("Unable to start server due to MongoDB connection failure.");
        process.exit(1);
    }
};

startServer();