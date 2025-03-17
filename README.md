# Product Assignment

## Description

This project is a backend service built using the [NestJS](https://nestjs.com/) framework. It includes features such as user authentication, post creation, liking/unliking posts, and caching with Redis.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Redis**: An in-memory data structure store, used as a database, cache, and message broker.
- **JWT**: JSON Web Tokens for authentication.
- **Winston**: A logger for Node.js.
- **Swagger**: API documentation generator.

## Project Setup

### Prerequisites

- Node.js (v22 or higher)
- Docker and Docker Compose

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=post_management
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=secret
```

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd product_assignment
```

2. Install the dependencies:

```bash
npm install
```

### Running the Application

#### Development

To start the application in development mode:

```bash
npm run start:dev
```

#### Production

To start the application in production mode:

```bash
npm run start:prod
```

### Running with Docker

To start the application using Docker Compose:
```bash
docker-compose up --build
```

## API Documentation
The API documentation is available at http://localhost:3000/api/docs after starting the application.

## API Design & Performance

The API is well-structured, following the principles of RESTful design. It leverages caching using Redis to optimize performance. The caching mechanism is implemented in the [`RedisCacheService`](src/cache/redis-cache.service.ts) class, which is used across various modules to cache frequently accessed data and reduce database load.

## Security & Authentication

Authentication is properly implemented using JWT (JSON Web Tokens). The JWT strategy is defined in the [`JwtStrategy`](src/auth/jwt.strategy.ts) class, and the authentication guard is implemented in the [`JwtAuthGuard`](src/auth/jwt-auth.guard.ts) class. The authentication service, [`AuthService`](src/auth/auth.service.ts), handles user validation and token generation. When user start login, we will not store the token add localstorage, we design to store it at cookie and have advance option to prevent XSS attacks or other ways attack

## Code Structure & Maintainability

The code is well-organized and follows the modular structure provided by the NestJS framework. Each feature is encapsulated in its own module, making the codebase easy to navigate and maintain. For example, the authentication logic is contained within the [`auth`](src/auth) module, and the caching logic is contained within the [`cache`](src/cache) module.

## Documentation

The project includes comprehensive API documentation generated using Swagger. The documentation is available at `http://localhost:3000/api/docs` after starting the application. This documentation provides detailed information about the available endpoints, request parameters, and responses, making it easy for developers to understand and use the API.