const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { getNumbers, getExpr, evalExpr } = require('./lib');

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// GET /add - add v1 and v2
app.get('/api/add', (req, res) => {
    const numbers = getNumbers(req, res);
    if (!numbers) return;

    const result = numbers.v1 + numbers.v2;
    res.json({
        action: 'add',
        v1: numbers.v1,
        v2: numbers.v2,
        result
    });
});

// GET /subtract - subtract v2 from v1
app.get('/api/subtract', (req, res) => {
    const numbers = getNumbers(req, res);
    if (!numbers) return;

    const result = numbers.v1 - numbers.v2;
    res.json({
        action: 'subtract',
        v1: numbers.v1,
        v2: numbers.v2,
        result
    });
});

// GET /multiply - multiply v1 and v2
app.get('/api/multiply', (req, res) => {
    const numbers = getNumbers(req, res);
    if (!numbers) return;

    const result = numbers.v1 * numbers.v2;
    res.json({
        action: 'multiply',
        v1: numbers.v1,
        v2: numbers.v2,
        result
    });
});

// GET /divide - divide v1 by v2
app.get('/api/divide', (req, res) => {
    const numbers = getNumbers(req, res);
    if (!numbers) return;

    if (numbers.v2 === 0) {
        return res.status(400).json({
            error: 'Cannot divide by zero.'
        });
    }

    const result = numbers.v1 / numbers.v2;
    res.json({
        action: 'divide',
        v1: numbers.v1,
        v2: numbers.v2,
        result
    });
});

// GET /power - raise v1 to the power of v2
app.get('/api/power', (req, res) => {
    const numbers = getNumbers(req, res);
    if (!numbers) return;

    const result = Math.pow(numbers.v1, numbers.v2);
    res.json({
        action: 'power',
        v1: numbers.v1,
        v2: numbers.v2,
        result
    });
});

// GET /root - extract the v2-th root of v1
app.get('/api/root', (req, res) => {
    const numbers = getNumbers(req, res);
    if (!numbers) return;

    if (numbers.v2 === 0) {
        return res.status(400).json({
            error: 'Cannot extract root with degree zero.'
        });
    }

    const result = Math.pow(numbers.v1, 1 / numbers.v2);
    res.json({
        action: 'root',
        v1: numbers.v1,
        v2: numbers.v2,
        result
    });
});

// POST /calculate - evaluate expression tree from JSON body
// Example body: { "op": "add", "args": [1, 2, {"op": "multiply", "args": [3, 4]}] }
app.post('/api/calculate', (req, res) => {
    const expr = getExpr(req, res);
    if (!expr) return;

    try {
        const result = evalExpr(expr);
        res.json({ action: 'calculate', result });
    } catch (e) {
        res.status(400).json({ error: String(e.message || e) });
    }
});

// Root endpoint
app.get('/api/', (req, res) => {
    res.json({
        message: 'Math Operations API',
        endpoints: [
            'GET /api/add?v1=<number>&v2=<number>',
            'GET /api/subtract?v1=<number>&v2=<number>',
            'GET /api/multiply?v1=<number>&v2=<number>',
            'GET /api/divide?v1=<number>&v2=<number>',
            'GET /api/power?v1=<number>&v2=<number>',
            'GET /api/root?v1=<number>&v2=<degree>',
            'POST /api/calculate  (JSON: { <expression tree> })'
        ],
        example_expression: {
            "op": "add",
            "args": [
                1,
                { "op": "power", "args": [2, 3] },
                { "op": "multiply", "args": [4, 5, 6] }
            ]
        }
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


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


