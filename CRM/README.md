# Nexus CRM

Nexus CRM is a Vite + React frontend with an Express + Sequelize backend.

Frontend:
- Vite
- React 19
- Mantine UI
- React Router
- Vercel Analytics

Backend:
- Express
- Sequelize
- TiDB/MySQL
- JWT auth
- Resend OTP email flow

## Requirements

Install these before running the project:
- Node.js 18 or newer
- npm 9 or newer
- A TiDB/MySQL database
- A Resend API key for OTP delivery
- Vercel account for frontend deployment
- Railway account for backend deployment, or another Node host

## Project Structure

```text
CRM/
├── src/                 # Frontend app
├── server/              # Express backend
├── vercel.json          # Vercel SPA config
├── package.json         # Frontend scripts and deps
├── server/package.json  # Backend scripts and deps
└── README.md
```

## Local Installation

### 1. Clone and install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 3. Configure environment variables

Frontend `.env.production` or Vercel environment variables:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

Backend `server/.env`:

```env
DB_HOST=your-tidb-host
DB_PORT=4000
DB_USERNAME=your-tidb-username
DB_PASSWORD=your-tidb-password
DB_DATABASE=your-database-name
DATABASE_URL=mysql://your-tidb-username:your-tidb-password@your-tidb-host:4000/your-database-name?sslaccept=strict

JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d

RESEND_API_KEY=replace-with-your-resend-api-key

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Run Locally

### Frontend

```bash
npm run dev
```

The Vite dev server runs at `http://localhost:5173`.

### Backend

```bash
cd server
npm run dev
```

The backend runs at `http://localhost:5000`.

### API health check

```bash
curl http://localhost:5000/api/health
```

## Deployment Overview

The recommended setup is:
- Frontend on Vercel
- Backend on Railway
- TiDB/MySQL as the database

## Deploy Frontend to Vercel

### 1. Push the repo

Make sure your code is committed and pushed to GitHub.

### 2. Import the project into Vercel

Use the Vercel dashboard or CLI.

```bash
npm i -g vercel
vercel
```

### 3. Set Vercel environment variables

Set:

```env
VITE_API_URL=https://your-railway-backend-domain/api
```

### 4. Redeploy

After updating env vars, redeploy the frontend.

### 5. SPA routing

The repo includes a rewrite in `vercel.json` so routes like `/login` and `/dashboard` work on refresh and direct entry.

## Deploy Backend to Railway

### 1. Use the `server/` directory as the root

The backend lives in the `server` folder, so Railway should point there.

### 2. Build and start commands

Use:

```bash
npm run build
npm start
```

The backend has a no-op build script because Express does not require a compile step.

### 3. Set Railway variables

Add the same backend variables from `server/.env` in Railway:
- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `CLIENT_URL=https://nexus-crm-leads.vercel.app`
- `PORT`

### 4. Update the frontend API URL

After Railway gives you a public backend URL, update Vercel:

```env
VITE_API_URL=https://your-railway-domain/api
```

## CORS

The backend allows these frontend origins:
- `http://localhost:5173`
- `http://localhost:3000`
- `https://nexus-crm-leads.vercel.app`

If you add another frontend domain, put it in `CLIENT_URL` or `CLIENT_URLS` on the backend.

## Vercel Analytics

The app includes `@vercel/analytics` and renders `<Analytics />` in `src/main.jsx`.
After deployment, page views should appear in Vercel Analytics once visitors navigate the site.

## Useful Commands

```bash
npm run dev
npm run build
npm run preview

cd server
npm run dev
npm run build
npm start
```

## Verification Checklist

- Frontend builds successfully with `npm run build`
- Backend starts with `npm start`
- `VITE_API_URL` points to the deployed backend
- Backend CORS includes the deployed frontend domain
- `/login` loads on direct navigation in production
- OTP request and verification work against the deployed backend

## Security Notes

- Do not commit real secrets into `.env` files
- Rotate any credentials that were already exposed
- Keep `DATABASE_URL`, `JWT_SECRET`, and `RESEND_API_KEY` in deployment env settings

