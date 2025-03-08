# Church Membership Management API Documentation

This document outlines all available API endpoints, request/response formats, and authentication requirements for the Church Membership Management API.

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Churches](#churches)
4. [Fellowships](#fellowships)
5. [Members](#members)
6. [Volunteer Opportunities](#volunteer-opportunities)
7. [Roles](#roles)
8. [Error Handling](#error-handling)

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

## Churches

Endpoints for managing church information.

### Get Current User's Church

Retrieves the church information associated with the currently authenticated user.

- **URL**: `/church/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "My Church",
  "domainName": "mychurch.com",
  "registrationNumber": "CHURCH-0001",
  "contactPhone": "1234567890",
  "contactEmail": "contact@mychurch.com",
  "createdAt": "2025-03-04T01:36:07.000Z",
  "updatedAt": "2025-03-04T01:36:07.000Z"
}
```

#### Error Response

- **Code**: 401 Unauthorized
  - This status code indicates that the provided token is invalid or expired
- **Content**: No content returned

## Fellowships

Endpoints for managing fellowships and their leadership roles.

### Get All Fellowships

Retrieves a list of all fellowships.

- **URL**: `/fellowship`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `fellowship.findAll`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "3ebc4ece469349e294b196f69e424ef9",
    "churchId": "19d4e951c2324768b20d689e2fc1ce81",
    "name": "TUMAINI",
    "notes": "Tumaini fellowship",
    "chairmanId": "1d4b928612524eaa93c3d84ecf433ef2",
    "deputyChairmanId": null,
    "secretaryId": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
    "treasurerId": null,
    "createdAt": "2025-03-05T05:10:38.000Z",
    "updatedAt": "2025-03-05T05:11:45.000Z",
    "chairman": {
      "id": "1d4b928612524eaa93c3d84ecf433ef2",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "255712345678"
      // Other member fields...
    },
    "secretary": {
      "id": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
      "firstName": "Jane",
      "lastName": "Smith",
      "phoneNumber": "255723456789"
      // Other member fields...
    }
  }
  // More fellowships...
]
```

### Get Fellowship by ID

Retrieves a specific fellowship by ID.

- **URL**: `/fellowship/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `fellowship.findById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "3ebc4ece469349e294b196f69e424ef9",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "TUMAINI",
  "notes": "Tumaini fellowship",
  "chairmanId": "1d4b928612524eaa93c3d84ecf433ef2",
  "deputyChairmanId": null,
  "secretaryId": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
  "treasurerId": null,
  "createdAt": "2025-03-05T05:10:38.000Z",
  "updatedAt": "2025-03-05T05:11:45.000Z",
  "chairman": {
    "id": "1d4b928612524eaa93c3d84ecf433ef2",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "255712345678"
    // Other member fields...
  },
  "secretary": {
    "id": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "255723456789"
    // Other member fields...
  }
}
```

### Create Fellowship

Creates a new fellowship without leadership roles. Leadership roles can be assigned later using the update endpoint once members have been created and assigned to the fellowship.

- **URL**: `/fellowship`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `fellowship.create`

#### Request Body

```json
{
  "name": "TUMAINI",
  "notes": "Tumaini fellowship"
}
```

#### Success Response

- **Code**: 201 Created
- **Content**:

```json
{
  "id": "3ebc4ece469349e294b196f69e424ef9",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "TUMAINI",
  "notes": "Tumaini fellowship",
  "chairmanId": null,
  "deputyChairmanId": null,
  "secretaryId": null,
  "treasurerId": null,
  "createdAt": "2025-03-05T05:10:38.000Z",
  "updatedAt": "2025-03-05T05:10:38.000Z"
}
```

### Update Fellowship

Updates an existing fellowship. This endpoint can be used to update fellowship details and assign leadership roles. All leadership roles (chairman, deputy chairman, secretary, treasurer) must be assigned to members who belong to this fellowship.

- **URL**: `/fellowship/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `fellowship.update`

#### Request Body

```json
{
  "name": "TUMAINI",
  "notes": "Tumaini fellowship",
  "chairmanId": "1d4b928612524eaa93c3d84ecf433ef2",
  "secretaryId": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
  "treasurerId": null,
  "deputyChairmanId": null
}
```

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "3ebc4ece469349e294b196f69e424ef9",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "TUMAINI",
  "notes": "Tumaini fellowship",
  "chairmanId": "1d4b928612524eaa93c3d84ecf433ef2",
  "deputyChairmanId": null,
  "secretaryId": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
  "treasurerId": null,
  "createdAt": "2025-03-05T05:10:38.000Z",
  "updatedAt": "2025-03-05T05:11:45.000Z",
  "chairman": {
    "id": "1d4b928612524eaa93c3d84ecf433ef2",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "255712345678"
    // Other member fields...
  },
  "secretary": {
    "id": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
    "firstName": "Jane",
    "lastName": "Smith",
    "phoneNumber": "255723456789"
    // Other member fields...
  }
}
```

#### Error Responses

- **Code**: 400 Bad Request

  - This status code indicates validation errors, such as assigning a member who does not belong to this fellowship as a leader
  - **Content**:
    ```json
    {
      "statusCode": 400,
      "message": {
        "chairmanId": "Member must belong to this fellowship to be assigned as chairman"
      },
      "error": "Bad Request"
    }
    ```

- **Code**: 404 Not Found
  - This status code indicates that the fellowship does not exist or does not belong to the current church
  - **Content**:
    ```json
    {
      "statusCode": 404,
      "message": "Not Found"
    }
    ```

### Delete Fellowship

Deletes a fellowship.

- **URL**: `/fellowship/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `fellowship.deleteById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "3ebc4ece469349e294b196f69e424ef9",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "TUMAINI",
  "notes": "Tumaini fellowship",
  "chairmanId": "1d4b928612524eaa93c3d84ecf433ef2",
  "deputyChairmanId": null,
  "secretaryId": "f2a5b97ec31b4d698a21c7dbc7e3a1f9",
  "treasurerId": null,
  "createdAt": "2025-03-05T05:10:38.000Z",
  "updatedAt": "2025-03-05T05:11:45.000Z"
}
```

#### Error Response

- **Code**: 404 Not Found
  - This status code indicates that the fellowship does not exist or does not belong to the current church

## Members

Endpoints for managing church members.

### Enumerated Field Values

The following table shows all possible values for enumerated fields in the member schema:

| Field                  | Possible Values                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| Gender                 | "Male", "Female"                                                                                                                                                          |
| Marital Status         | "Single", "Married", "Separated", "Divorced"                                                                                                                              |
| Marriage Type          | "Christian", "Non-Christian"                                                                                                                                              |
| Education Level        | "Informal", "Primary", "Secondary", "Certificate", "Diploma", "Bachelors", "Masters", "Doctorate", "Other"                                                                |
| Member Role            | "Clergy", "Staff", "Regular", "Leader", "Volunteer"                                                                                                                       |
| Dependant Relationship | "Child", "House Helper", "Relative", "Parent", "Sibling", "Grandchild", "Grandparent", "Niece/Nephew", "Guardian", "Ward", "Spouse", "In-Law", "Extended Family", "Other" |     |

### Get All Members

Retrieves a list of all members belonging to the current church.

- **URL**: `/member`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `member.findAll`
- **Query Parameters**:
  - Supports objection-find library query parameters for filtering

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "1d4b928612524eaa93c3d84ecf433ef2",
    "churchId": "19d4e951c2324768b20d689e2fc1ce81",
    "envelopeNumber": "1245",
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1985-06-14T21:00:00.000Z",
    "placeOfBirth": "Dar es Salaam",
    "profilePhoto": "https://example.com/photos/john-doe.jpg",
    "maritalStatus": "Married",
    "marriageType": "Christian",
    "dateOfMarriage": "2010-09-21T21:00:00.000Z",
    "spouseName": "Sarah Doe",
    "placeOfMarriage": "Arusha",
    "phoneNumber": "255712345678",
    "email": "john.doe@example.com",
    "spousePhoneNumber": "255798765432",
    "residenceNumber": "Block 5, House 23",
    "residenceBlock": "Mikocheni B",
    "postalBox": "P.O. Box 12345",
    "residenceArea": "Mikocheni",
    "formerChurch": "Grace Community Church",
    "occupation": "Software Engineer",
    "placeOfWork": "Tech Solutions Ltd",
    "educationLevel": "Bachelors",
    "profession": "Computer Science",
    "memberRole": "Regular",
    "isBaptized": 1,
    "isConfirmed": 1,
    "partakesLordSupper": 1,
    "fellowshipId": "3ebc4ece469349e294b196f69e424ef9",
    "nearestMemberName": "James Wilson",
    "nearestMemberPhone": "+255723456789",
    "attendsFellowship": 1,
    "fellowshipAbsenceReason": null,
    "createdAt": "2025-03-07T04:41:29.000Z",
    "updatedAt": "2025-03-07T04:41:29.000Z",
    "dependants": [
      {
        "id": "b9a57f0991bc42b9985b61c2231d166d",
        "churchId": "19d4e951c2324768b20d689e2fc1ce81",
        "memberId": "1d4b928612524eaa93c3d84ecf433ef2",
        "firstName": "Michael",
        "lastName": "Doe",
        "dateOfBirth": "2015-03-10T00:00:00.000Z",
        "relationship": "Child",
        "createdAt": "2025-03-07T04:41:29.000Z",
        "updatedAt": "2025-03-07T04:41:29.000Z"
      }
    ],
    "interests": [
      {
        "id": "cdd519e8cec247aca455ec05faccfad2",
        "churchId": "19d4e951c2324768b20d689e2fc1ce81",
        "name": "Main Choir",
        "description": null,
        "createdAt": "2025-03-07T04:41:29.000Z",
        "updatedAt": "2025-03-07T04:41:29.000Z"
      }
    ]
  }
  // More members...
]
```

### Get Member by ID

Retrieves a specific member by ID.

- **URL**: `/member/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `member.findById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "1d4b928612524eaa93c3d84ecf433ef2",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "envelopeNumber": "1245",
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "1985-06-14T21:00:00.000Z",
  "placeOfBirth": "Dar es Salaam",
  "profilePhoto": "https://example.com/photos/john-doe.jpg",
  "maritalStatus": "Married",
  "marriageType": "Christian",
  "dateOfMarriage": "2010-09-21T21:00:00.000Z",
  "spouseName": "Sarah Doe",
  "placeOfMarriage": "Arusha",
  "phoneNumber": "255712345678",
  "email": "john.doe@example.com",
  "spousePhoneNumber": "255798765432",
  "residenceNumber": "Block 5, House 23",
  "residenceBlock": "Mikocheni B",
  "postalBox": "P.O. Box 12345",
  "residenceArea": "Mikocheni",
  "formerChurch": "Grace Community Church",
  "occupation": "Software Engineer",
  "placeOfWork": "Tech Solutions Ltd",
  "educationLevel": "Bachelors",
  "profession": "Computer Science",
  "memberRole": "Regular",
  "isBaptized": 1,
  "isConfirmed": 1,
  "partakesLordSupper": 1,
  "fellowshipId": "3ebc4ece469349e294b196f69e424ef9",
  "nearestMemberName": "James Wilson",
  "nearestMemberPhone": "+255723456789",
  "attendsFellowship": 1,
  "fellowshipAbsenceReason": null,
  "createdAt": "2025-03-07T04:41:29.000Z",
  "updatedAt": "2025-03-07T04:41:29.000Z",
  "dependants": [
    {
      "id": "b9a57f0991bc42b9985b61c2231d166d",
      "churchId": "19d4e951c2324768b20d689e2fc1ce81",
      "memberId": "1d4b928612524eaa93c3d84ecf433ef2",
      "firstName": "Michael",
      "lastName": "Doe",
      "dateOfBirth": "2015-03-10T00:00:00.000Z",
      "relationship": "Child",
      "createdAt": "2025-03-07T04:41:29.000Z",
      "updatedAt": "2025-03-07T04:41:29.000Z"
    },
    {
      "id": "c0b68e1a2c3d4e5f6a7b8c9d0e1f2g3h",
      "churchId": "19d4e951c2324768b20d689e2fc1ce81",
      "memberId": "1d4b928612524eaa93c3d84ecf433ef2",
      "firstName": "Sarah",
      "lastName": "Doe",
      "dateOfBirth": "2018-07-22T00:00:00.000Z",
      "relationship": "Child",
      "createdAt": "2025-03-07T04:41:29.000Z",
      "updatedAt": "2025-03-07T04:41:29.000Z"
    }
  ],
  "interests": [
    {
      "id": "cdd519e8cec247aca455ec05faccfad2",
      "churchId": "19d4e951c2324768b20d689e2fc1ce81",
      "name": "Main Choir",
      "description": null,
      "createdAt": "2025-03-07T04:41:29.000Z",
      "updatedAt": "2025-03-07T04:41:29.000Z"
    }
  ]
}
```

### Create Member

Creates a new member.

- **URL**: `/member`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `member.create`

#### Request Body

```json
{
  "envelopeNumber": "1245",
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "1985-06-15",
  "placeOfBirth": "Dar es Salaam",
  "profilePhoto": "https://example.com/photos/john-doe.jpg",
  "maritalStatus": "Married",
  "marriageType": "Christian",
  "dateOfMarriage": "2010-09-22",
  "spouseName": "Sarah Doe",
  "placeOfMarriage": "Arusha",
  "phoneNumber": "255712345678",
  "email": "john.doe@example.com",
  "spousePhoneNumber": "255798765432",
  "residenceNumber": "Block 5, House 23",
  "residenceBlock": "Mikocheni B",
  "postalBox": "P.O. Box 12345",
  "residenceArea": "Mikocheni",
  "formerChurch": "Grace Community Church",
  "occupation": "Software Engineer",
  "placeOfWork": "Tech Solutions Ltd",
  "educationLevel": "Bachelors",
  "profession": "Computer Science",
  "memberRole": "Regular",
  "isBaptized": true,
  "isConfirmed": true,
  "partakesLordSupper": true,
  "fellowshipId": "3ebc4ece469349e294b196f69e424ef9",
  "nearestMemberName": "James Wilson",
  "nearestMemberPhone": "+255723456789",
  "attendsFellowship": true,
  "fellowshipAbsenceReason": null,
  "dependants": [
    {
      "firstName": "Michael",
      "lastName": "Doe",
      "dateOfBirth": "2015-03-10",
      "relationship": "Child"
    },
    {
      "firstName": "Sarah",
      "lastName": "Doe",
      "dateOfBirth": "2018-07-22",
      "relationship": "Child"
    }
  ],
  "interests": ["cdd519e8cec247aca455ec05faccfad2"]
}
```

### Update Member

Updates an existing member.

- **URL**: `/member/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `member.update`

#### Request Body

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "255712345678",
  "email": "john.smith@example.com",
  "dependants": [
    {
      "id": "b9a57f0991bc42b9985b61c2231d166d",
      "firstName": "Michael",
      "lastName": "Smith"
    }
  ],
  "addDependants": [
    {
      "firstName": "Emma",
      "lastName": "Smith",
      "dateOfBirth": "2020-05-15",
      "relationship": "Child"
    }
  ],
  "removeDependantIds": ["c0b68e1a2c3d4e5f6a7b8c9d0e1f2g3h"],
  "interests": ["cdd519e8cec247aca455ec05faccfad2"]
}
```

### Delete Member

Deletes a member.

- **URL**: `/member/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `member.deleteById`

#### Success Response

- **Code**: 200 OK
- **Content**: Deleted member object

## Volunteer Opportunities

Endpoints for managing volunteer opportunities.

### Get All Opportunities

Retrieves a list of all volunteer opportunities.

- **URL**: `/opportunity`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `opportunity.findAll`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
[
  {
    "id": "cdd519e8cec247aca455ec05faccfad2",
    "churchId": "19d4e951c2324768b20d689e2fc1ce81",
    "name": "Main Choir",
    "description": null,
    "createdAt": "2025-03-08T08:51:36.000Z",
    "updatedAt": "2025-03-08T08:54:31.000Z"
  }
  // More opportunities...
]
```

### Get Opportunity by ID

Retrieves a specific volunteer opportunity by ID.

- **URL**: `/opportunity/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `opportunity.findById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "cdd519e8cec247aca455ec05faccfad2",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "Main Choir",
  "description": null,
  "createdAt": "2025-03-08T08:51:36.000Z",
  "updatedAt": "2025-03-08T08:54:31.000Z"
}
```

### Create Opportunity

Creates a new volunteer opportunity.

- **URL**: `/opportunity`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `opportunity.create`

#### Request Body

```json
{
  "name": "Children's Choir Assistant",
  "description": "Assist the music director in organizing and leading rehearsals for the children's choir."
}
```

#### Success Response

- **Code**: 201 Created
- **Content**:

```json
{
  "id": "cdd519e8cec247aca455ec05faccfad2",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "Children's Choir Assistant",
  "description": "Assist the music director in organizing and leading rehearsals for the children's choir.",
  "createdAt": "2025-03-08T08:51:36.000Z",
  "updatedAt": "2025-03-08T08:51:36.000Z"
}
```

### Update Opportunity

Updates an existing volunteer opportunity.

- **URL**: `/opportunity/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `opportunity.update`

#### Request Body

```json
{
  "name": "Main Choir Leader",
  "description": "Lead the church's main choir during Sunday services and special events."
}
```

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "cdd519e8cec247aca455ec05faccfad2",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "Main Choir Leader",
  "description": "Lead the church's main choir during Sunday services and special events.",
  "createdAt": "2025-03-08T08:51:36.000Z",
  "updatedAt": "2025-03-08T08:54:31.000Z"
}
```

### Delete Opportunity

Deletes a volunteer opportunity.

- **URL**: `/opportunity/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer token)
- **Required Permissions**: `opportunity.deleteById`

#### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "id": "cdd519e8cec247aca455ec05faccfad2",
  "churchId": "19d4e951c2324768b20d689e2fc1ce81",
  "name": "Main Choir",
  "description": null,
  "createdAt": "2025-03-08T08:51:36.000Z",
  "updatedAt": "2025-03-08T08:54:31.000Z"
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
