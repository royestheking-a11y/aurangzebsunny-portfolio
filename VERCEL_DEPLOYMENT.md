# Vercel Deployment Guide 🚀

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Your MongoDB cluster is already set up
3. **GitHub Account**: (Optional, but recommended for easy deployment)

## Step 1: Prepare Your Project

### Environment Variables

You'll need to set these in Vercel:

1. **MONGODB_URI**: Your MongoDB connection string
   ```
   mongodb+srv://dhakacollection7_db_user:jygKryBIhdNhls8y@auraportfolio.54fkobm.mongodb.net/?appName=Auraportfolio
   ```

2. **MONGODB_DB_NAME**: Database name
   ```
   auraportfolio
   ```

3. **VITE_API_URL**: (Optional) Will be auto-set to your Vercel URL in production

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
   - Or drag and drop your project folder
4. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `./` (root)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI` = `mongodb+srv://dhakacollection7_db_user:jygKryBIhdNhls8y@auraportfolio.54fkobm.mongodb.net/?appName=Auraportfolio`
     - `MONGODB_DB_NAME` = `auraportfolio`

6. **Deploy!**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   # Paste: mongodb+srv://dhakacollection7_db_user:jygKryBIhdNhls8y@auraportfolio.54fkobm.mongodb.net/?appName=Auraportfolio
   
   vercel env add MONGODB_DB_NAME
   # Paste: auraportfolio
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

After deployment, your site will be available at:
- **Production URL**: `https://your-project.vercel.app`
- **API Endpoints**: `https://your-project.vercel.app/api/*`

### Test Your API

1. **Health Check**:
   ```
   https://your-project.vercel.app/api/health
   ```

2. **Test Projects Endpoint**:
   ```
   https://your-project.vercel.app/api/projects
   ```

## Step 4: Update Frontend API URL (if needed)

The frontend automatically uses the correct API URL:
- **Development**: `http://localhost:5001/api` (when running locally)
- **Production**: Automatically uses your Vercel deployment URL

If you need to override, set `VITE_API_URL` in Vercel environment variables.

## Project Structure for Vercel

```
/
├── api/                    # Vercel serverless functions
│   ├── _helpers/          # Shared utilities
│   │   ├── db.ts         # MongoDB connection
│   │   └── cors.ts       # CORS handling
│   ├── projects.ts       # GET, POST /api/projects
│   ├── projects/[id].ts  # PUT, DELETE /api/projects/:id
│   ├── posts.ts
│   ├── videos.ts
│   ├── ... (all other endpoints)
│   └── health.ts         # Health check
├── src/                   # Frontend React app
├── dist/                  # Build output (generated)
├── vercel.json           # Vercel configuration
└── package.json
```

## API Endpoints Available

All endpoints are available at `https://your-project.vercel.app/api/*`:

- `GET /api/health` - Health check
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate
- `DELETE /api/certificates/:id` - Delete certificate
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/qas` - Get all Q&As
- `POST /api/qas` - Create Q&A
- `PUT /api/qas/:id` - Update Q&A
- `DELETE /api/qas/:id` - Delete Q&A
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create message
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `GET /api/newsletter` - Get all newsletter subscriptions
- `POST /api/newsletter` - Subscribe to newsletter
- `DELETE /api/newsletter/:id` - Unsubscribe
- `GET /api/analytics` - Get analytics
- `POST /api/contact` - Submit contact form
- `POST /api/aura/submit` - Submit Aura Assistant form

## Troubleshooting

### MongoDB Connection Issues

1. **Check Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify `MONGODB_URI` and `MONGODB_DB_NAME` are set

2. **Check MongoDB Atlas**:
   - Ensure your IP is whitelisted (or use 0.0.0.0/0 for all IPs)
   - Verify connection string is correct

3. **Check Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments → Click on deployment → View Function Logs

### API Not Working

1. **Check API Routes**:
   - Visit `https://your-project.vercel.app/api/health`
   - Should return JSON with status "ok"

2. **Check CORS**:
   - All API routes have CORS enabled
   - Should work from any origin

3. **Check Frontend API URL**:
   - Open browser console
   - Check network tab for API calls
   - Verify they're going to correct URL

### Build Errors

1. **Check Build Logs**:
   - Vercel Dashboard → Deployments → Click failed deployment
   - Review build logs

2. **Common Issues**:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Fix type errors
   - Missing environment variables → Add to Vercel

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB_NAME` | Database name | `auraportfolio` |
| `VITE_API_URL` | (Optional) Frontend API URL | `https://your-project.vercel.app/api` |

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] MongoDB connection working (check `/api/health`)
- [ ] Frontend loads correctly
- [ ] Admin panel accessible
- [ ] All CRUD operations working
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Test API endpoints directly
4. Verify environment variables

---

**Your project is now ready to deploy to Vercel!** 🎉

