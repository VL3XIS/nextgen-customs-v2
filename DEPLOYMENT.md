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
   cd frontend
   npm install
   npm run dev
   ```

## Release Log (v2.1 - "The Marketing Engine")
- **Command Center:** Holographic UI, Framer Motion animations, real-time metrics.
- **Social Studio:** Added "Reel Creator" (Beta) with Flash Cut tech.
- **AI Engine:** "Growth Hacker" prompt engineering (v4) for Instagram/LinkedIn viral hooks.
- **Voice Agent:** Integration ready for ElevenLabs.
  - **Auto-Update Script:** Run `npx ts-node backend/scripts/update_agent_vercel.ts` to sync tools with your Vercel URL.
  - **Configuration:** Managed via `elevenlabs_agent_config.json`.
