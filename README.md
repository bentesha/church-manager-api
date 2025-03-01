# Church Membership Management API

## Overview

This project is a **NestJS-based API** backend for a **church membership management web application**. It provides endpoints for managing churches, users, roles, and permissions, ensuring secure and efficient church administration.

## Features

- **Church Management**: Create and manage churches.
- **User Management**: Register, update, and authenticate users.
- **Role-Based Access Control (RBAC)**: Assign roles and define actions users can perform.
- **Session Management**: Secure authentication and session handling.
- **Permission Enforcement**: Restrict access to endpoints based on user roles.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: MySQL with [Knex.js](https://knexjs.org/) & [Objection.js](https://vincit.github.io/objection.js/)
- **Validation**: Class-validator
- **Dependency Management**: npm/yarn

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **MySQL**
- **Yarn or npm**

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/bentesha/church-manager-api
   cd church-manager-api
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Create a `.env` file from `.env.example` and configure your database:
   ```sh
   cp .env.example .env
   ```
4. Run database migrations:
   ```sh
   npx knex migrate:latest
   ```
5. Seed the database with default roles and admin user:
   ```sh
   npx knex seed:run
   ```
6. Start the application:
   ```sh
   npm run start:dev
   ```

## Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, contact [your email or team contact info].
