# Math Operations Express Server

A simple Node.js Express server that provides mathematical operation endpoints.

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

## Endpoints

- `GET /add` - Returns the sum of `v1` and `v2`
- `GET /subtract` - Returns the difference of `v1` and `v2`
- `GET /multiply` - Returns the product of `v1` and `v2`
- `GET /divide` - Returns the quotient of `v1` divided by `v2`
- `GET /power` - Returns `v1` raised to the power of `v2`
- `GET /root` - Returns the `v2`-th root of `v1`
- `POST /calculate` - Performs the specified operation based on the JSON body

All GET endpoints accept two query parameters: `v1` and `v2`
POST endpoint expects a RAW JSON body with a nested expression tree. Each node must have:
- `op`: operation name (one of "add", "subtract", "multiply", "divide", "power" or "root")
- `args`: array of arguments (numbers or nested operation objects)

### Example POST Request Body
```json
{
  "op": "add",
  "args": [
    1,
    { "op": "power", "args": [2, 3] },
    { "op": "multiply", "args": [4, 5, 6] }
  ]
}
```

## Author

* Developed by **Andrej Kudriavcev**
* Student ID: **224939307**