# Users REST API

A layered REST API for managing users, built with Node.js and Express 5.

## Features

- RESTful Users API
- Layered architecture
- In-memory repository
- User CRUD operations
- Request validation
- Password hashing using Node.js `scrypt`
- Duplicate email protection
- Pagination
- Sorting
- Search
- Request ID tracking
- Request logging
- Centralized error handling
- Environment-based configuration
- Security against mass assignment
- Password and password hash are never exposed in API responses

## Technologies

- Node.js
- Express 5
- JavaScript ES Modules
- npm
- Git

## Project Structure

```text
src/
├── config/
│   └── env.js
├── controllers/
│   └── users.controller.js
├── middleware/
│   ├── error-handler.js
│   ├── not-found.js
│   ├── request-id.js
│   ├── request-logger.js
│   └── validate-body.js
├── repositories/
│   ├── in-memory.repository.js
│   └── users.repository.js
├── routes/
│   └── users.routes.js
├── services/
│   └── users.service.js
├── utils/
│   ├── http-error.js
│   ├── password.js
│   └── query.js
├── validators/
│   ├── rules.js
│   ├── user.schema.js
│   └── validate.js
├── app.js
└── server.js
```