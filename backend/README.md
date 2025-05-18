# AIdly Health Companion Backend

This is the backend server for the AIdly Health Companion application. It provides a RESTful API for managing user health data, metrics, and recommendations.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository and navigate to the backend directory:

```bash
cd aidly-health-companion/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aidly-health
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development

# Optional configurations
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB service on your machine

5. Build the TypeScript code:

```bash
npm run build
```

6. Start the development server:

```bash
npm run dev
```

The server will start on http://localhost:5000 by default.

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user

  - Body: `{ email: string, password: string, name: string }`

- POST `/api/auth/login` - Login user
  - Body: `{ email: string, password: string }`

### User Endpoints (Protected)

- GET `/api/users/me` - Get current user profile
- PATCH `/api/users/me` - Update current user profile

  - Body: `{ name?: string, email?: string }`

- PATCH `/api/users/me/health` - Update health data
  - Body: `{ height?: number, weight?: number, bloodType?: string, allergies?: string[], medications?: string[], conditions?: string[] }`

### Health Metrics Endpoints (Protected)

- POST `/api/health/metrics` - Log health metrics

  - Body: `{ type: string, value: string | number, unit: string, timestamp?: string }`

- GET `/api/health/metrics/:type` - Get health metrics history

  - Query params: `from?: string, to?: string`

- GET `/api/health/recommendations` - Get health recommendations

- GET `/api/health/summary` - Get health summary

### Admin Endpoints (Protected, Admin Only)

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get specific user
- DELETE `/api/users/:id` - Delete user

## Development

- Run tests: `npm test`
- Run linter: `npm run lint`
- Build for production: `npm run build`
- Start production server: `npm start`

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Security

- All passwords are hashed using bcrypt
- JWT is used for authentication
- Input validation is performed using express-validator
- CORS is enabled and configurable
- Environment variables are used for sensitive data
