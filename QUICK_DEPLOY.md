# Quick Vercel Deployment Guide 🚀

## Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Sign up/Login
3. Click "Add New Project"
4. Import your Git repository OR drag & drop your project folder
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Add Environment Variables**:
   - `MONGODB_URI` = `mongodb+srv://dhakacollection7_db_user:jygKryBIhdNhls8y@auraportfolio.54fkobm.mongodb.net/?appName=Auraportfolio`
   - `MONGODB_DB_NAME` = `auraportfolio`
7. Click "Deploy"

### Option B: Via CLI

```bash
# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
# Paste: mongodb+srv://dhakacollection7_db_user:jygKryBIhdNhls8y@auraportfolio.54fkobm.mongodb.net/?appName=Auraportfolio

vercel env add MONGODB_DB_NAME
# Paste: auraportfolio

# Deploy to production
vercel --prod
```

## Step 3: Verify

After deployment, visit:
- Your site: `https://your-project.vercel.app`
- API health: `https://your-project.vercel.app/api/health`

## That's It! 🎉

Your portfolio is now live on Vercel with MongoDB!

