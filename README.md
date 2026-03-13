# Tax Tools NG

Production-oriented full-stack Nigerian tax calculator with a React client and Express API.

## Stack

- `client`: React + Vite
- `server`: Express API with validation, rate limiting, compression, and production static serving
- MongoDB persistence
- Brevo SMTP email verification
- JWT authentication with roles

## Run locally

1. Install dependencies:
   `npm install`
2. Start both apps:
   `npm run dev`

If PowerShell blocks `npm`, use:
`npm.cmd run dev`

## Production build

1. Build:
   `npm run build`
2. Start the server:
   `npm run start`

In production, the Express server serves the built React app from `client/dist`.

## Environment

Copy `.env.example` to `.env` and adjust values if needed.

- `PORT`: API/server port
- `ALLOWED_ORIGINS`: comma-separated list of allowed browser origins in production
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign access tokens
- `JWT_EXPIRES_IN`: token lifetime such as `7d`
- `APP_BASE_URL`: frontend origin used in verification email links
- `SMTP_HOST` / `SMTP_PORT`: Brevo SMTP endpoint
- `SMTP_USER` / `SMTP_PASS`: Brevo SMTP credentials
- `SMTP_FROM_EMAIL` / `SMTP_FROM_NAME`: sender identity for verification emails
- `VITE_API_BASE_URL`: optional absolute API base for deployed frontend builds
- `LOG_LEVEL`: reserved for future structured logging policy

## Notes

- Users, contact messages, and calculator runs are stored in MongoDB.
- Calculator outputs are estimates and should be reviewed against current official guidance before filing.

## Auth routes

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`
- `GET /api/auth/me` with `Authorization: Bearer <token>`

## Admin backend routes

Use a bearer token from an authenticated admin account.

- `GET /api/admin/messages`
- `GET /api/admin/calculations`
- `GET /api/admin/dashboard`

## Tests

- Run all automated checks:
  `npm test`

## Docker

Build:
`docker build -t tax-tools-ng .`

Run:
`docker run -p 4000:4000 --env-file .env tax-tools-ng`
