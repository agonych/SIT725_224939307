# MVC Book Catalogue App

A simple Express MVC app that serves a books catalogue backed by MongoDB.

## Getting Started

```bash
npm install          # install dependencies
npm run seed         # populate MongoDB bookCatalogue database
npm start            # start the server on http://localhost:3000
npm run dev          # restart on change with nodemon
```

## API Endpoints

- `GET /api/books` supports optional `genre`, `year`, and `author` filters.
- `GET /api/books/:id` returns a single book by its identifier.

## Frontend

- Home page offers a button to fetch and populate the list of books when 
  user click it.
- Clicking on any item in the list shows a modal popup with full book profile.
- Basic error handling is implemented.

## Author

- Andrej Kudriavcev (224939307)
