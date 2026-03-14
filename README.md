# Nigeria Tax Calculator

Production-oriented full-stack Nigerian tax calculator with a React client and Express API.

## Stack

- `client`: React + Vite
- `server`: Express API with validation, rate limiting, compression, and production static serving
- MongoDB persistence
- Brevo SMTP email verification
- JWT authentication with roles
- Paystack checkout for consultations, PDF reports, and business subscriptions

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

Before you deploy, make sure these production requirements are met:

- `MONGODB_URI` points to a reachable MongoDB instance
- `JWT_SECRET` is a strong secret of at least 32 characters
- `APP_BASE_URL` uses your real `https://` domain
- `ALLOWED_ORIGINS` contains your real frontend origin(s)
- Brevo SMTP credentials are configured if you want email verification to work

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
- `PAYSTACK_SECRET_KEY`: secret key used to initialize and verify transactions
- `PAYSTACK_PUBLIC_KEY`: reserved for future frontend Paystack features
- `REPORT_STORAGE_DIR`: optional absolute path for storing generated paid PDF reports
- `VITE_API_BASE_URL`: optional absolute API base for deployed frontend builds
- `LOG_LEVEL`: reserved for future structured logging policy

## Notes

- Users, contact messages, and calculator runs are stored in MongoDB.
- Monetization requests for support, consultation, PDF reports, and subscriptions are stored in MongoDB.
- Calculator outputs are estimates and should be reviewed against current official guidance before filing.
- If the built frontend is served by the same Express process, leave `VITE_API_BASE_URL` empty.

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
- `GET /api/admin/monetization`
- `GET /api/admin/dashboard`

## Monetization routes

- `GET /api/monetization/plans`
- `POST /api/monetization/request` for free support leads
- `POST /api/monetization/checkout` to initialize Paystack payments
- `GET /api/monetization/verify?reference=...` to confirm a completed Paystack payment
- `GET /api/monetization/download/:reference` to download a generated paid PDF report
- `POST /api/monetization/webhook` for Paystack webhooks

## Tests

- Run all automated checks:
  `npm test`

## Docker

Build:
`docker build -t tax-tools-ng .`

Run:
`docker run -p 4000:4000 --env-file .env tax-tools-ng`

## Deploy backend on Render

You can deploy the backend as a Render web service from this repository.

Recommended Render settings:

- Root directory: repository root
- Environment: `Node`
- Build command: `npm ci && npm run build --workspace server`
- Start command: `npm run start --workspace server`
- Health check path: `/api/health`

This repo also includes [render.yaml](/c:/Users/user/Desktop/SOFTWARE/TX%20CALCULATOR/render.yaml) if you prefer a Render Blueprint deploy.

Minimum environment variables to set in Render:

- `NODE_ENV=production`
- `ALLOWED_ORIGINS=https://your-frontend-domain.com`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `APP_BASE_URL=https://your-frontend-domain.com`
- `SMTP_USER=...`
- `SMTP_PASS=...`
- `SMTP_FROM_EMAIL=...`
- `PAYSTACK_SECRET_KEY=...`
- `PAYSTACK_PUBLIC_KEY=...`

Important deployment note:

- `APP_BASE_URL` should be your frontend URL, not the Render backend URL, because email verification links and the Paystack payment callback currently return users to the frontend route `/payment/verify`.
- If you deploy only the backend and not the frontend yet, tax calculation APIs will work, but the full auth and Paystack user flow will not be complete until the frontend is hosted too.
