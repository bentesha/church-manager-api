# Church Membership Management API Documentation

This document outlines all available API endpoints, request/response formats, and authentication requirements for the Church Membership Management API.

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Churches](#churches)
4. [Roles](#roles)
5. [Error Handling](#error-handling)

## Authentication

Authentication is required for most endpoints. The API uses token-based authentication. 

All endpoints (except `/auth/login`) require a Bearer token in the Authorization header:

```
Authorization: Bearer 5f37cf57978edcaa7102bd970864a502fb65c5dd1b00abd849f1de09721a1672
```

This token is obtained from the `/auth/login` response.

### Login

Authenticates a user and returns a token for subsequent API calls.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No

#### Request Body

```json
{
  "username": "admin@mychurch.com",
  "password": "guest"
}
```

#### Success Response

- **Code**: 201 Created
- **Content**:

```json
{
  "token": "5f37cf57978edcaa7102bd970864a502fb65c5dd1b00abd849f1de09721a1672",
  "user": {
    "id": "a6a57f0991bc42b9985b61c2231d166c",
    "name": "Admin",
    "email": "admin@mychurch.com",
    "phoneNumber": null,
    "churchId": "72fa27c044ef42b888b45fd5b0da1ce1",
    "roleId": "5998e820e6234cd18a4f8e1c1ee1734f",
    "isActive": 1,
    "isDeleted": 0,
    "createdAt": "2025-03-01T17:42:28.000Z",
    "updatedAt": "2025-03-01T17:42:28.000Z"
  },
  "allowedActions": [
    "user.create",
    "user.delete",
    "user.findAll",
    "user.findById",
    "user.update"
  ]
}
```

#### Error Response

- **Code**: 400 Bad Request
  - This status code indicates that the provided credentials (username/password) are invalid
- **Content**: No content returned

### Get Current User

Retrieves the currently authenticated user's information.

- **URL**: `/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "user": {
    "id": "a4dd3932c8f1490985019047f3fcf512",
    "name": "Admin",
    "email": "admin@mychurch.com",
    "phoneNumber": null,
    "churchId": "ef134982fbc34987b25d6cd8dda2561b",
    "roleId": "0aab9ef85f46477396a300479a3f06b9",
    "isActive": 1,
    "isDeleted": 0,
    "createdAt": "2025-03-01T10:50:45.000Z",
    "updatedAt": "2025-03-01T10:50:45.000Z"
  },
  "allowedActions": [
    "user.create",
    "user.delete",
    "user.findAll",
    "user.findById",
    "user.update"
  ]
}
```

#### Error Response

- **Code**: 401 Unauthorized
  - This status code indicates that the provided token is invalid or expired
- **Content**: No content returned

### Logout

Invalidates the current user's token.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer token)

#### Success Response

- **Code**: 201 Created
- **Content**: No content returned

## Users

Endpoints for managing user accounts.

### Get All Users

Retrieves a list of all users.

- **URL**: `/user`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `user.findAll`
- **Query Parameters**:
  - Supports objection-find library query parameters for filtering

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "a4dd3932c8f1490985019047f3fcf512",
    "name": "Admin",
    "email": "admin@mychurch.com",
    "phoneNumber": null,
    "churchId": "ef134982fbc34987b25d6cd8dda2561b",
    "roleId": "0aab9ef85f46477396a300479a3f06b9",
    "isActive": 1,
    "isDeleted": 0,
    "createdAt": "2025-03-01T10:50:45.000Z",
    "updatedAt": "2025-03-01T10:50:45.000Z"
  }
  // More users...
]
```

### Get User by ID

Retrieves a specific user by ID.

- **URL**: `/user/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `user.findById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "a4dd3932c8f1490985019047f3fcf512",
  "name": "Admin",
  "email": "admin@mychurch.com",
  "phoneNumber": null,
  "churchId": "ef134982fbc34987b25d6cd8dda2561b",
  "roleId": "0aab9ef85f46477396a300479a3f06b9",
  "isActive": 1,
  "isDeleted": 0,
  "createdAt": "2025-03-01T10:50:45.000Z",
  "updatedAt": "2025-03-01T10:50:45.000Z"
}
```

### Create User

Creates a new user.

- **URL**: `/user`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `user.create`

#### Request Body

```json
{
  "name": "Jonn Solomon",
  "email": "john.solomn@mychurch.com",
  "password": "securepassword",
  "phoneNumber": "+255786908766",
  "roleId": "5998e820e6234cd18a4f8e1c1ee1734f"
}
```

#### Success Response

- **Code**: 201 Created
- **Content**:

```json
{
	"id": "790ed7d77d3940489343a06e719fe7db",
	"name": "John Solomon",
	"email": "john.solomon@mychurch.com",
	"phoneNumber": "255786908766",
	"churchId": "ef134982fbc34987b25d6cd8dda2561b",
	"roleId": "0aab9ef85f46477396a300479a3f06b9",
	"isActive": 1,
	"isDeleted": 0,
	"createdAt": "2025-03-01T14:25:40.000Z",
	"updatedAt": "2025-03-01T14:39:36.000Z"
}
```

### Update User

Updates an existing user.

- **URL**: `/user/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `user.update`

#### Request Body

```json
{
  "name": "James Kisamo",
  "phoneNumber": "255786908766"
}
```

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
	"id": "790ed7d77d3940489343a06e719fe7db",
	"name": "James Kisamo",
	"email": "james.kisamo@mychurch.com",
	"phoneNumber": "255786908766",
	"churchId": "ef134982fbc34987b25d6cd8dda2561b",
	"roleId": "0aab9ef85f46477396a300479a3f06b9",
	"isActive": 1,
	"isDeleted": 0,
	"createdAt": "2025-03-01T14:25:40.000Z",
	"updatedAt": "2025-03-01T14:39:36.000Z"
}
```

### Delete User

Deletes a user (soft delete).

- **URL**: `/user/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `user.delete`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
	"id": "790ed7d77d3940489343a06e719fe7db",
	"name": "James Kisamo",
	"email": "james.kisamo@mychurch.com",
	"phoneNumber": "255786908766",
	"churchId": "ef134982fbc34987b25d6cd8dda2561b",
	"roleId": "0aab9ef85f46477396a300479a3f06b9",
	"isActive": 1,
	"isDeleted": 0,
	"createdAt": "2025-03-01T14:25:40.000Z",
	"updatedAt": "2025-03-01T14:39:36.000Z"
}
```


## Roles

Endpoints for managing roles and permissions.

### Get All Roles

Retrieves a list of all roles.

- **URL**: `/role`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Permissions**: `role.findAll`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "data": [
    {
      "id": "0fc03face2bc4e3aa9d8aa735458ebfc",
      "name": "Admin",
      "churchId": "19d4e951c2324768b20d689e2fc1ce81",
      "description": null,
      "createdAt": "2025-03-04T04:36:08.000Z",
      "updatedAt": "2025-03-04T04:36:08.000Z"
    }
    // More roles...
  ]
}
```

### Get Role by ID

Retrieves a specific role by ID.

- **URL**: `/role/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Required Permissions**: `role.findById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
	"id": "0fc03face2bc4e3aa9d8aa735458ebfc",
	"name": "Admin",
	"churchId": "19d4e951c2324768b20d689e2fc1ce81",
	"description": null,
	"createdAt": "2025-03-04T04:36:08.000Z",
	"updatedAt": "2025-03-04T04:36:08.000Z"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests.

### Common Error Responses

#### Unauthorized

- **Code**: 401 Unauthorized
- **Content**:

```json
{
  "statusCode": 401,
  "message": "Unauthorized access",
  "error": "Unauthorized"
}
```

#### Forbidden

- **Code**: 403 Forbidden
- **Content**:

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

#### Not Found

- **Code**: 404 Not Found
- **Content**:

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

#### Validation Error

- **Code**: 400 Bad Request
- **Content**:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 6 characters"
  ],
  "error": "Bad Request"
}
```

#### Server Error

- **Code**: 500 Internal Server Error
- **Content**:

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```