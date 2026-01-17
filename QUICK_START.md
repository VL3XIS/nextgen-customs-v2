# 🚀 Quick Start - Deploy in 5 Minutes

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login
```bash
vercel login
```

## Step 3: Deploy!
```bash
cd /Users/USER/Desktop/nextgen-customs-v2
vercel
```

## Step 4: Add Environment Variables
Go to your Vercel dashboard → Project Settings → Environment Variables

Add these:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Any random secret (e.g., `mySecretKey123!`)
- `OPENAI_API_KEY` - Your OpenAI API key

## Step 5: Redeploy
```bash
vercel --prod
```

## Done! 🎉

Your Next Gen Customs dashboard is now live!

---

## What You Got:
✅ Logo integrated everywhere
✅ Modern red/black theme matching your designs
✅ All 6 pages styled perfectly
✅ Ready for production deployment
✅ Vercel configuration files added

## Need a Database?
Use Vercel Postgres (easiest):
```bash
vercel postgres create
```

This will give you a DATABASE_URL automatically!
