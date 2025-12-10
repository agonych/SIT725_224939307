const SUPPORTED_OPS = new Set(['add', 'subtract', 'multiply', 'divide', 'power', 'root']);

export function getNumbers(req, res) {
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
export function isFiniteNumber(x) {
    return typeof x === 'number' && Number.isFinite(x);
}

// Helper to get the expression JSON from POST body
export function getExpr(req, res) {
    const expr = req.body ?? {};
    if (expr === undefined) {
        res.status(400).json({ error: 'Missing the expression in POST body.' });
        return null;
    }
    return expr;
}

// Helper to compute nth root
export function nthRoot(value, n) {
    return Math.pow(value, 1 / n);
}

// Helper to evaluate the expression tree recursively
export function evalExpr(node) {
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