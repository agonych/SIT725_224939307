# Kudriavcev Coffee Shop Website

An Express + Materialize demo that serves a small coffee shop landing page with a dynamic hero section, menu cards populated from an API, and an order modal that posts to the backend.

## Installation

Install dependencies:
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

The app runs on `http://localhost:3000` by default.

## Features

- Responsive hero banner with logo and gallery.
- Coffee menu fetched from `GET /api/menu`.
- Order modal that collects customer details (first/last name, contact info, address) and posts to `POST /api/orders`.
- Orders are logged to the server console for review.

## API Endpoints

- `GET /api/menu` &mdash; returns the list of coffee products.
- `POST /api/orders` &mdash; accepts JSON payloads with customer and order details and logs them.
- `GET /api/` &mdash; simple API overview.

## Author

* Developed by **Andrej Kudriavcev**
* Student ID: **224939307**


