# Next Gen Customs V2 - AI Social Media Platform

A production-ready AI platform for Next Gen Customs, featuring automated social media post generation, job tracking, and analytics.

## Features
- **Red/Black Branding**: Custom automotive-themed UI.
- **AI Post Generation**: Uses Anthropic Claude to generate multi-platform posts.
- **Job Management**: create, track, and review repair jobs.
- **Analytics**: Track time saved and post engagement.
- **Secure Auth**: JWT-based authentication for shop owners.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Recharts/Chart.js.
- **Backend**: Node.js, Express, Prisma, PostgreSQL.
- **AI**: Anthropic Claude API.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL Database (local or cloud)

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env # (Or create .env based on instructions)
npx prisma db push
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.
