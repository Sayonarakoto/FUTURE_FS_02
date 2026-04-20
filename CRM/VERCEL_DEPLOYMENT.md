# Vercel Frontend Deployment Guide

## Overview
This is a Vite + React frontend application configured for deployment on Vercel.

## Configuration Files

### 1. vercel.json
- **buildCommand**: Builds the Vite app (`npm run build`)
- **outputDirectory**: Serves the `dist/` folder (Vite's output)
- **framework**: Set to `vite` for automatic optimization
- **devCommand**: Local development with `npm run dev`

## Deployment Steps

### Step 1: Connect to Vercel
```bash
# Option A: Via Vercel CLI
npm i -g vercel
vercel

# Option B: Via GitHub
# Push your code to GitHub and import the repo at vercel.com/new
```

### Step 2: Set Environment Variables in Vercel
In Vercel Dashboard → Settings → Environment Variables, add:

```
VITE_API_URL=https://your-backend-domain.com/api
```

On the backend, allow the deployed frontend origin:

```
CLIENT_URL=https://nexus-crm-leads.vercel.app
```

Update `src/api/axios.js` to use:
```javascript
const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Step 3: Backend API Communication
Since your backend is on a different domain/server:

#### Option A: Update axios base URL dynamically
Edit `src/api/axios.js`:
```javascript
const apiBaseURL = 
  import.meta.env.VITE_API_URL || 
  (() => {
    if (typeof window !== 'undefined') {
      return window.location.origin.includes('localhost') 
        ? 'http://localhost:5000/api'
        : 'https://your-deployed-backend.com/api'
    }
    return '/api'
  })();
```

#### Option B: Use environment-based configuration
Create `.env.production` in root:
```
VITE_API_URL=https://your-backend-domain.com/api
```

## Project Structure
```
CRM/
├── vercel.json          (Vercel config)
├── vite.config.js       (Vite config)
├── package.json         (Dependencies & scripts)
├── src/                 (React source code)
│   ├── App.jsx
│   ├── api/axios.js     (API client - needs update)
│   ├── components/
│   ├── pages/
│   └── context/
├── public/              (Static assets)
└── index.html           (Entry point)
```

## Important Notes

### 1. API Calls
Your local `vite.config.js` has a proxy for dev:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

This **only works in development**. For production (Vercel), you need to:
- Use absolute URLs to your backend
- Configure CORS on your backend
- Update axios base URL for production

### 2. CORS Requirements
Ensure your backend (`server.js`) has CORS configured:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://nexus-crm-leads.vercel.app'],
  credentials: true
}));
```

### 3. Static Site
Vite builds to static HTML/CSS/JS - Vercel serves this optimally with:
- Automatic minification
- Image optimization
- Caching headers
- CDN distribution

### 4. Build Artifacts
After `npm run build`:
- `dist/` contains your complete frontend
- This is what Vercel serves to users
- Can be tested locally with `npm run preview`

## Testing Before Deployment

```bash
# Build locally
npm run build

# Preview the build
npm run preview

# Visit http://localhost:4173 and test all features
```

## Deployment Checklist

- [ ] Set `VITE_API_URL` environment variable in Vercel
- [ ] Update `src/api/axios.js` to handle production URLs
- [ ] Configure CORS on backend
- [ ] Build and preview locally: `npm run build && npm run preview`
- [ ] Connect GitHub repo to Vercel (or use Vercel CLI)
- [ ] Deploy and test API calls
- [ ] Monitor Vercel logs in dashboard

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy immediately
vercel --prod

# View deployment logs
vercel logs

# Pull environment variables
vercel env pull

# Local preview
npm run preview
```

## Links
- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment Guide](https://vite.dev/guide/static-deploy.html)
- [Vite Environment Variables](https://vite.dev/guide/env-and-mode.html)
