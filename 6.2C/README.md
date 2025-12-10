# Calculator API Test Suite

Mocha/Chai tests for the calculator Express API and its helper functions.

## Run the Tests

Install the Node.js dependencies:

```bash
npm install
```

Start the API in one terminal before running the suite:

```bash
npm run dev
```

Run the tests in another terminal:

```bash
npm test
```

## Implemented Tests

### Calculator API
- Tests if the API is running and responds with HTTP 200.
- Test successful addition of two numbers.
- Test handling missing parameters in addition endpoint 
- Test handling of non-numeric parameters in addition endpoint.

### Calculate Functionality
- Test evalExpr function with a valid JSON expression.
- Test handling of unsupported operator in expression.
- Test handling invalid node in expression.

## Author

- Andrej Kudriavcev (224939307)
