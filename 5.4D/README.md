# MVC Book Catalogue App with Safe-write Endpoints

A simple Express MVC app that serves a books catalogue backed by MongoDB with data validation
and safe-write endpoints for creating and updating book records.

## Getting Started

```bash
npm install          # install dependencies
npm run seed         # populate MongoDB bookCatalogue database
npm start            # start the server on http://localhost:3000
npm run dev          # OR restart on change with nodemon
```

## API Endpoints

- `GET /api/books` supports optional `genre`, `year`, and `author` filters.
- `GET /api/books/:id` returns a single book by its identifier.
- `POST /api/books` creates a new book record.
- `PUT /api/books/:id` updates an existing book.
- `DELETE /api/books/:id` removes a book record.

## Validation Rules

| Field          | Rule                                             | Description                                                                                                                                     | Justification                                                                                          |
|----------------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `id`           | required, string, unique, matches `b[1-9][0-9]*` | Every book must supply a custom identifier starting with `b` followed by a non-zero number; whitespace is stripped and duplicates are rejected. | Enforces consistent identifiers, keeps data format predictable, and prevents accidental resubmissions. |
| `title`        | required, string, 1…150 chars                    | Book titles must be supplied and not exceed 150 characters; whitespace is trimmed.                                                              | Forbids blank, null, or excessively long titles.                                                       |
| `author`       | required, string, 1…100 chars                    | Author names must be supplied and not exceed 100 characters; whitespace is trimmed.                                                             | Forbids blank, null, or excessively author names.                                                      |
| `year`         | required, integer, 1…current year                | Publication year must be a positive number that is not in the future.                                                                           | Forbids blank, null, or future years.                                                                  |
| `genre`        | required, string, 1…50 chars                     | Genre must be supplied and not exceed 50 characters; whitespace is trimmed.                                                                     | Forbids blank, null, or excessively genres.                                                            |
| `summary`      | required, string, 10…1000 chars                  | Summaries must be supplied, trimmed, and between 10 and 1000 characters.                                                                        | Forbids blank, null, too-short, or excessively summaries.                                              |
| `price`        | required, Decimal128, positive, ≤2 decimals      | Prices are stored with precise decimals; must be greater than zero and accept at most two decimal places.                                       | Preserves accurate monetary values and forbids blank, null, or invalid prices.                         |
| Unknown fields | forbidden                                        | Create/update payloads do not allow keys other than schema fields.                                                                              | Guards against typos and invalid payloads.                                                             |

## Safe-write Endpoints

### `POST /api/books`

- **Payload**: JSON body containing `id`, `title`, `author`, `year`, `genre`, `summary`, `price`; unknown fields are rejected.
- **Responses**:
  - `201 Created`
    ```json
    {
      "status": 201,
      "data": { "...": "..." },
      "message": "Book created successfully"
    }
    ```
  - `400 Bad Request`
    ```json
    {
      "status": 400,
      "message": "Validation failed",
      "errors": [
        "please supply the title"
      ]
    }
    ```
  - `409 Conflict`
    ```json
    {
      "status": 409,
      "message": "Book with id 'b6' already exists"
    }
    ```
  - `500 Internal Server Error`
    ```json
    {
      "status": 500,
      "message": "Failed to create book"
    }
    ```

### `PUT /api/books/:id`

- **Payload**: JSON body with any subset of writable fields (`title`, `author`, `year`, `genre`, `summary`, `price`); `id` changes and unknown fields are blocked.
- **Responses**:
  - `200 OK`
    ```json
    {
      "status": 200,
      "data": { "...": "..." },
      "message": "Book updated successfully"
    }
    ```
  - `400 Bad Request`
    ```json
    {
      "status": 400,
      "message": "Validation failed",
      "errors": [
        "please supply the title"
      ]
    }
    ```
  - `404 Not Found`
    ```json
    {
      "status": 404,
      "message": "Book not found"
    }
    ```
  - `500 Internal Server Error`
    ```json
    {
      "status": 500,
      "message": "Failed to update book"
    }
    ```

## Frontend

- Home page offers a button to fetch and populate the list of books when 
  user click it.
- Clicking on any item in the list shows a modal popup with full book profile.
- Basic error handling is implemented.

## Author

- Andrej Kudriavcev (224939307)
