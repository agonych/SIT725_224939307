# Coffee Shop API + UI (MongoDB Edition)

Full-stack Node.js demo that serves a Materialize front-end backed by Express and MongoDB. Menu items now come from a `Product` collection instead of being hard-coded.

## Getting Started

```bash
npm install          # install dependencies
npm run seed         # populate MongoDB with sample products
npm start            # start the server on http://localhost:3000
```

## API Highlights

- `GET /api/menu` returns products stored in MongoDB.
- `POST /api/orders` accepts JSON orders and logs them for review.

## Tech Stack

- Express + Materialize front-end
- MongoDB via Mongoose
- dotenv-based configuration

## Author

- Andrej Kudriavcev (224939307)
