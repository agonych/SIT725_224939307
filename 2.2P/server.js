const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const SUPPORTED_OPS = new Set(['add', 'subtract', 'multiply', 'divide', 'power', 'root']);

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper to validate and parse GET query parameters
function getNumbers(req, res) {
    const v1 = parseFloat(req.query.v1);
    const v2 = parseFloat(req.query.v2);
    if (isNaN(v1) || isNaN(v2)) {
        res.status(400).json({
            error: 'Invalid parameters. Both v1 and v2 must be valid numbers.'
        });
        return null;
    }
    return { v1, v2 };
}

// Helper to check if a value is a finite number
function isFiniteNumber(x) {
    return typeof x === 'number' && Number.isFinite(x);
}

// Helper to get the expression JSON from POST body
function getExpr(req, res) {
    const expr = req.body ?? {};
    if (expr === undefined) {
        res.status(400).json({ error: 'Missing the expression in POST body.' });
        return null;
    }
    return expr;
}

// Helper to compute nth root
function nthRoot(value, n) {
    return Math.pow(value, 1 / n);
}

// Helper to evaluate the expression tree recursively
function evalExpr(node) {
    // check if node is a number literal
    if (isFiniteNumber(node)) return node;

    // object node: { op, args }
    if (!node || typeof node !== 'object') {
        throw new Error('Invalid node: must be a number or { op, args }.');
    }

    // extract operator and arguments from node
    const { op, args } = node;

    // Check if operator is supported
    if (!SUPPORTED_OPS.has(op)) {
        throw new Error(`Unsupported "op". Supported: ${[...SUPPORTED_OPS].join(', ')}`);
    }

    // Check if args is a non-empty array
    if (!Array.isArray(args) || args.length === 0) {
        throw new Error(`"${op}" requires at least one argument.`);
    }

    // Evaluate children first (acts like brackets)
    const values = args.map(evalExpr);
    values.forEach(v => {
        if (!isFiniteNumber(v)) throw new Error('Non-numeric value encountered.');
    });

    // Perform the operation based on given operator
    switch (op) {
        case 'add':
            // sum all values
            return values.reduce((acc, v) => acc + v, 0);

        case 'multiply':
            // multiply all values
            return values.reduce((acc, v) => acc * v, 1);

        case 'subtract':
            // left-associative fold: (((a - b) - c) - d)
            return values.length === 1
                ? values[0]
                : values.slice(1).reduce((acc, v) => acc - v, values[0]);

        case 'divide':
            // left-associative fold: (((a / b) / c) / d)
            if (values.length === 1) return values[0];
            if (values.slice(1).some(v => v === 0)) {
                throw new Error('Cannot divide by zero.');
            }
            return values.slice(1).reduce((acc, v) => acc / v, values[0]);

        case 'power':
            // left-associative fold: (((a ** b) ** c) ** d)
            return values.length === 1
                ? values[0]
                : values.slice(1).reduce((acc, exp) => Math.pow(acc, exp), values[0]);

        case 'root':
            // if only one value, compute square root
            if (values.length === 1) {
                const x = values[0];
                return Math.sqrt(x);
            }
            // left-fold roots: root(a, n, m, ...) = root(root(a, n), m) ...
            return values.slice(1).reduce((acc, n) => nthRoot(acc, n), values[0]);

        default:
            throw new Error(`Unhandled operator: ${op}`);
    }
}

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
