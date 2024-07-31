# AquaTrack Backend

AquaTrack Backend is a RESTful API built using `Node.js` and `Express.js`. It allows users to easily track their water consumption, monitor progress towards their goals and set personal water recommendations.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Developers](#developers)
- [Routes](#routes)
  - [Auth](#auth)
  - [User](#user)
  - [WaterRecord](#waterrecord)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Deployment](#deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KristinaHranovska/node-rest-api
   cd node-rest-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables (see Environment Variables section).
4. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

## Usage

To interact with the API, you can use tools like `Postman` or `cURL`. Below are the available routes and their descriptions.

## API Documentation

The API is documented using `Swagger`. After starting the server, you can access the `Swagger UI` at:

```arduino
https://aqua-track-api.onrender.com/api-docs
```

## Developers

### [@KristinaHranovska](https://github.com/KristinaHranovska)

- Full implementation of `/users` endpoint:
  - Creation of a public user `registration` endpoint.
  - Creation of a public user `login` endpoint.
  - Writing the `authorization` layer.
  - Creation of a private endpoint for receiving information about the current user.
  - Creation of a private endpoint for updating data of an authorized user (name, email, gender, weight, active time for sports, daily water intake and avatar).
  - Creation of a private endpoint for issuing a new pair of tokens (access and update).
  - Creating a private endpoint for user `logout`.
  - Implementation of the image saving mechanism using `Cloudinary`.
  - Implementation of authorization through `Google`.
  - Creation of an endpoint for changing the user's password in case he forgot his password.
  - Implementation of email verification using `.ejs`.

### [@SvitlanaOseichuk](https://github.com/SvitlanaOseichuk)

- BackEnd - `/water` endpoint:
  - Creation of a private endpoint for adding a record of the volume of water consumed.
  - Creation of a private endpoint for editing a record of the volume of water consumed.
  - Creation of a private endpoint for deleting a record of the volume of water consumed.
  - Creation of a private endpoint for receiving data on the user's water consumption per day.
  - Creation of a private endpoint for receiving data on the user's water consumption for a month.
  - Writing Swagger for the `/water` endpoint.

### [@Olena-Ihnatenko](https://github.com/Olena-Ihnatenko)

- Writing Swagger for `/users` endpoint.

## Routes

### Auth

- User registration

  ```http
  POST /users/signup
  ```

  Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "message": "User registered successfully. Please check your email to verify your account."
}
```

- User login

  ```http
  POST /users/signin
  ```

  Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://res.cloudinary.com/dntbkzhtq/image/upload/v1719141998/AquaTrack/defaultAvatar.webp",
  "dailyWaterNorm": 1.5,
  "message": "Welcome back, John Doe to the AquaTrack!"
}
```

- User logout

  ```http
  POST /users/logout
  ```

  Request body:

```json
{
  "id": "667ea32bdcebb99c66d54321"
}
```

Response:

```json
{
  "message": "You have successfully exited"
}
```

- Verify user email

```http
GET /users/verify/{verificationToken}
```

Response:

```json
{
  "message": "Verification successful. You can now access your account."
}
```

- Refresh user access token

  ```http
  POST /users/refresh-tokens
  ```

  Request body:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWQyZWRkMTEwYjBiOGRlZjQ4MTY1ZiIsImlhdCI6MTcwNTg0ODg3NSwiZXhwIjoxNzA2NDUzNjc1fQ.MONgGZKIUzqvq13OAlJvBctxJl1rt5OXMFQeIiZm2Aq"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjFlMjVmNmIwYTJjY2I5NTU5MWVjNyIsImlhdCI6MTY4OTM3OTQyMywiZXhwIjoxNjg5NDYyMjIzfQ.hT2Ta6pBhDR1vOF7LjcKxofyASDPjcTZtFi9CESKIuA",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWQyZWRkMTEwYjBiOGRlZjQ4MTY1ZiIsImlhdCI6MTcwNTg0ODg3NSwiZXhwIjoxNzA2NDUzNjc1fQ.MONgGZKIUzqvq13OAlJvBctxJl1rt5OXMFQeIiZm2A"
}
```

- Forgot password

  ```http
  POST /users/forgot
  ```

  Request body:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "message": "Password recovery email has been sent"
}
```

- Reset user password

  ```http
  POST /users/reset
  ```

  Request body:

```json
{
  "resetToken": "f7c564e8-7317-4c76-b5d2-2a0606b1e03a",
  "password": "newPassword123"
}
```

Response:

```json
{
  "message": "Password has been reset successfully"
}
```

- Google OAuth

  ```http
  GET /users/google
  ```

- Google OAuth redirect

  ```http
  GET /users/google-redirect
  ```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### User

- Update user profile

```http
PATCH /users/update
```

Request body:

```json
{
  "name": "John Doe",
  "avatar": "https://res.cloudinary.com/dntbkzhtq/image/upload/v1719141998/AquaTrack/defaultAvatar.webp",
  "gender": "male",
  "weight": 70,
  "dailyActivityTime": 3,
  "dailyWaterNorm": 3
}
```

Response:

```json
{
  "_id": "60dcf3c65f45a500153e4b27",
  "name": "John Doe",
  "email": "user@example.com",
  "gender": "male",
  "weight": 70,
  "dailyActivityTime": 3,
  "dailyWaterNorm": 3,
  "avatar": "https://res.cloudinary.com/dntbkzhtq/image/upload/v1719141998/AquaTrack/defaultAvatar.webp"
}
```

- Get user profile

```http
GET /users/profile
```

Response:

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://res.cloudinary.com/dntbkzhtq/image/upload/v1719141998/AquaTrack/defaultAvatar.webp",
  "gender": "woman",
  "weight": 0,
  "dailyActivityTime": 0,
  "dailyWaterNorm": 1.5
}
```

- Get happy endpoint

```http
GET /users/happy
```

Response:

```json
{
  "count": 100,
  "avatars": [
    "https://res.cloudinary.com/dntbkzhtq/image/upload/v1719141998/AquaTrack/avatar.webp"
  ]
}
```

### WaterRecord

- Add water record

```http
POST /water
```

Request body:

```json
{
  "amount": 0.4,
  "date": "2024-07-10T10:17:20.886Z"
}
```

Response:

```json
{
  "newWaterRecord": {
    "amount": 0.5,
    "date": "2024-07-10T10:17:20.886Z",
    "owner": "667c4a6aa00f3339fea36b1b",
    "_id": "66855549f18f2eac7515fd00",
    "createdAt": "2024-07-03T13:42:33.278Z",
    "updatedAt": "2024-07-03T13:42:33.278Z"
  },
  "message": "Water record successfully added"
}
```

- Update water amount

```http
PUT /water/:id
```

Request body:

```json
{
  "amount": 0.2,
  "date": "2024-07-10T10:17:20.886Z"
}
```

Response:

```json
{
  "updatedRecord": {
    "_id": "66855549f18f2eac7515fd00",
    "amount": 0.2,
    "date": "2024-07-10T10:17:20.886Z",
    "owner": "667c4a6aa00f3339fea36b1b",
    "createdAt": "2024-07-03T13:42:33.278Z",
    "updatedAt": "2024-07-03T13:45:35.216Z"
  },
  "message": "Water record successfully updated"
}
```

- Delete water record

```http
DELETE /water/:id
```

Request body:

```json
{
  "id": "66855549f18f2eac7515fd00"
}
```

Response:

```json
{
  "newWaterRecord": {
    "amount": 0.3,
    "date": "2024-06-28T11:35:59.880Z",
    "owner": "4579687c17342250d5344321",
    "_id": "667ea32bdcebb99c66d54321",
    "createdAt": "2024-06-28T11:48:59.927Z",
    "updatedAt": "2024-06-28T13:26:25.271Z"
  },
  "message": "Water record succesfully deleted"
}
```

- Get a daily water record

```http
GET /water/daily/:date
```

Response:

```json
{
  "totalAmountForDay": 1.4,
  "percentComplete": 75,
  "records": [
    {
      "amount": 0.5,
      "date": "2024-07-01T12:30:00Z",
      "owner": "614f5e3e8c48d53a08a7efc6"
    }
  ]
}
```

- Get a mouthly water record

```http
GET /water/monthly/:year/:month
```

Response:

```json
{
  "totalWaterForMonth": 23.4,
  "daysInMonth": [
    {
      "id": "67ca1234dceba44ac54b6",
      "day": "2024-06-26",
      "totalAmount": 1,
      "percentComplete": 66.66
    },
    {
      "id": "654ad234dceba44dab345",
      "day": "2024-06-27",
      "totalAmount": 0.75,
      "percentComplete": 50
    },
    {
      "id": "545bc32bdceba44d66d54",
      "day": "2024-06-28",
      "totalAmount": 1.2,
      "percentComplete": 80
    }
  ]
}
```

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```makefile
DB_HOST=
PORT=
SENDGRID_API_KEY=
SECRET_KEY=
REFRESH_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BASE_URL=
FRONTEND_URL=
```

Replace `your_mongodb_connection_string` with your actual MongoDB connection string.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## Deployment

The code is deployed using [render.com](https://render.com/). You can access the deployed application at:

```arduino
https://aqua-track-api.onrender.com/
```
