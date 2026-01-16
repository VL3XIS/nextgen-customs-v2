# Deployment Configuration & Guide

## Database (Railway PostgreSQL)
1. Create a new PostgreSQL service in Railway.
2. Get the connection string (e.g., `postgresql://postgres:password@roundhouse.proxy.rlwy.net:5432/railway`).
3. Set this as `DATABASE_URL` in your Backend Environment Variables.

## Backend (Railway or Render)
**Environment Variables:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=production_secret_key_very_long_and_random
ANTHROPIC_API_KEY=sk-ant-... (Your Claude API Key)
PORT=3001
NODE_ENV=production
```
**Build Command:** `npm run build`
**Start Command:** `npm start`

## Frontend (Vercel)
**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```
**Build Command:** `npm run build`
**Output Directory:** `dist`

## Local Development
1. **Backend:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run dev
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
