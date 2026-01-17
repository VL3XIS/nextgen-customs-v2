# Next Gen Customs - Vercel Deployment Guide

## ✅ Your Dashboard is Ready!

All pages have been updated to match your exact design specifications with the new logo integrated.

---

## 🚀 Deploy to Vercel (2 Options)

### **Option 1: Deploy via Vercel CLI (Recommended)**

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the project root:**
   ```bash
   cd /Users/USER/Desktop/nextgen-customs-v2
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? → **Yes**
   - Which scope? → Choose your account
   - Link to existing project? → **No**
   - What's your project's name? → `nextgen-customs` (or your choice)
   - In which directory is your code located? → `./`
   - Want to override the settings? → **No**

5. **Set Environment Variables** (in Vercel Dashboard):
   - Go to your project settings
   - Add these environment variables:
     ```
     DATABASE_URL=your_postgres_connection_string
     JWT_SECRET=your_secret_key
     OPENAI_API_KEY=your_openai_key
     ```

6. **Redeploy after adding env variables:**
   ```bash
   vercel --prod
   ```

---

### **Option 2: Deploy via Vercel Dashboard (GitHub)**

1. **Push your code to GitHub:**
   ```bash
   cd /Users/USER/Desktop/nextgen-customs-v2
   git init
   git add .
   git commit -m "Initial commit - Next Gen Customs Dashboard"
   gh repo create nextgen-customs --private --source=. --remote=origin
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com) and login**

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure Build Settings:**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

6. **Add Environment Variables** (in project settings):
   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_key
   NODE_ENV=production
   ```

7. **Deploy!**

---

## 📦 What's Included

### ✅ Frontend Updates:
- ✅ Logo integrated in sidebar
- ✅ Logo on login page
- ✅ Modern glass-morphism design
- ✅ Red neon theme throughout
- ✅ All 6 pages styled to match renderings:
  - Overview/Dashboard
  - Jobs (Kanban Board)
  - Job History
  - New Job
  - Settings
  - Analytics

### ✅ Backend Features:
- Express.js API
- PostgreSQL database with Prisma ORM
- JWT authentication
- OpenAI integration for post generation
- Job management endpoints
- Analytics endpoints

---

## 🔧 Environment Variables Needed

Create a `.env` file in the `backend` directory or add these to Vercel:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# OpenAI (for AI post generation)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Server
PORT=3001
NODE_ENV=production
```

---

## 🎨 Logo Details

- **Location:** `/frontend/public/logo.svg`
- **Format:** SVG (scalable, crisp at any size)
- **Colors:** Matches your brand (Red #D0202F + Silver gradient)
- **Used in:**
  - Sidebar (240px wide)
  - Login page (280px wide)
  - Both with red glow effects

---

## 🌐 Running Locally (Before Deploy)

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Opens at: `http://localhost:5173`

### Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
Opens at: `http://localhost:3001`

---

## 📱 Features After Deployment

Your live dashboard will have:
- ✅ Secure authentication (JWT)
- ✅ Job management (create, update, delete)
- ✅ Kanban board with drag-and-drop
- ✅ AI-powered social media post generation
- ✅ Analytics and reporting
- ✅ Settings management
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Your Next Gen Customs branding

---

## 🚨 Important Notes

1. **Database:** You need a PostgreSQL database. Options:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (easy)
   - [Supabase](https://supabase.com) (free tier)
   - [Railway](https://railway.app) (simple setup)
   - [Neon](https://neon.tech) (serverless Postgres)

2. **OpenAI API:** Required for AI post generation
   - Get key from [platform.openai.com](https://platform.openai.com)

3. **Domain:** Vercel gives you a free `.vercel.app` domain
   - You can add custom domain later in project settings

---

## 📞 Support

If you run into issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure DATABASE_URL is accessible from Vercel
4. Check that all npm dependencies installed correctly

---

**Your dashboard is production-ready! 🎉**
