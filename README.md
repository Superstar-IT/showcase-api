# Assignment Description
----------------------

You are tasked with creating a RESTful API server using Express.js and TypeScript. The server should provide authentication using JSON Web Tokens (JWT), integrate with a third-party API for user data, and have a database layer for storing user information. The assignment also requires the implementation of middleware functions for request logging and error handling. Additionally, you need to write unit tests to ensure the functionality of the server.

## Requirements

1.  Implement a user authentication system using JWT. The API should have the following endpoints:
    
    *   `/api/auth/register` - Register a new user with email and password.
    *   `/api/auth/login` - Log in a user and return a JWT token.
    *   `/api/auth/profile` - Retrieve the user's profile information using the JWT token (protected route).
2.  Integrate with a third-party API to fetch user data. Use the [Random User Generator API](https://randomuser.me) to retrieve random user details. The API should have the following endpoint:
    
    *   `/api/users/random` - Fetch a random user's details from the third-party API.
3.  Implement a middleware function for request logging. Log the method, URL, and timestamp of each incoming request.
    
4.  Implement a middleware function for error handling. Handle any uncaught errors and return appropriate error responses to the client.
    
5.  Implement a database layer to store and retrieve user information. You can use any database of your choice (e.g., MongoDB, PostgreSQL, SQLite).
    
6.  Write unit tests for the API routes, middleware functions, and database layer using a testing framework of your choice (e.g., Jest).
    
## Tech Stacks

- TypeScript
- PostgreSQL
- JWT
- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [Jest](https://jestjs.io/docs/getting-started)
- [Zod](https://zod.dev/)
- [morgan](https://github.com/expressjs/morgan#readme)
- [Axios](https://axios-http.com/docs/intro)

## Quick run

```bash
$ git clone https://github.com/Superstar-IT/showcase-api.git
$ cd showcase-api
$ cp example.env .env
$ yarn install

# Run migration
$ yarn migrate:run

# development
$ yarn dev

# production mode
$ yarn build
$ yarn start
```
## Test

```bash
# unit tests
$ yarn test
```

## Database utils

```bash
# Generate migration
$ yarn migrate:generate src/migrations/createNewTable

# Run migration
$ yarn migrate:run
```