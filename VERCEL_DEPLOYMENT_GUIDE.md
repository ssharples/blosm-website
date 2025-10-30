# Vercel Deployment Guide for Payload CMS

**Date:** October 29, 2025
**Purpose:** Deploy Blosm website with Payload CMS to Vercel

---

## 🚨 Important: Environment Variables Required

Before deployment, you MUST set up environment variables in Vercel. The build will fail without them.

---

## Step 1: Create Neon Database

1. Go to **https://neon.tech**
2. Sign up/login with GitHub
3. Create new project:
   - **Name:** `blosm-cms`
   - **Region:** US East (closest to Vercel)
   - **PostgreSQL:** 16 (default)
4. **Copy connection string:**
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb
   ```

---

## Step 2: Create Vercel Blob Storage

1. Go to **Vercel Dashboard** → Your Project → **Storage**
2. Click **Create Database** → **Blob**
3. Name: `blosm-media`
4. Region: Same as deployment (us-east-1)
5. Click **Create**
6. Go to **.env.local** tab
7. **Copy** `BLOB_READ_WRITE_TOKEN` value

---

## Step 3: Generate Secret Keys

Run these commands locally to generate secure keys:

```bash
# Generate PAYLOAD_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate AI_AGENT_API_KEY
node -e "console.log('ai_' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Set Environment Variables in Vercel

### Via Vercel Dashboard:

1. Go to **Vercel Dashboard** → Your Project
2. Click **Settings** → **Environment Variables**
3. Add the following variables for **Production, Preview, and Development**:

#### Payload CMS Variables (NEW)

| Variable Name | Value | Example |
|--------------|-------|---------|
| `DATABASE_URI` | Neon connection string (from Step 1) | `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb` |
| `PAYLOAD_SECRET` | Generated secret (from Step 3) | `a1b2c3d4e5f6...` (64 chars) |
| `NEXT_PUBLIC_SERVER_URL` | Your production URL | `https://blosm.dev` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (from Step 2) | `vercel_blob_rw_xxx` |
| `AI_AGENT_API_KEY` | Generated API key (from Step 3) | `ai_a1b2c3d4e5f6...` |
| `ANTHROPIC_API_KEY` | Your Claude API key | `sk-ant-api03-xxx` |

#### Existing Variables (KEEP THESE)

| Variable Name | Current Value |
|--------------|---------------|
| `GOOGLE_CLIENT_ID` | (your existing value) |
| `GOOGLE_CLIENT_SECRET` | (your existing value) |
| `GOOGLE_REFRESH_TOKEN` | (your existing value) |
| `GOOGLE_REDIRECT_URI` | `https://blosm.dev/api/auth/google/callback` |
| `RESEND_API_KEY` | (your existing value) |
| `RESEND_FROM_EMAIL` | `hello@updates.blosm.dev` |
| `KV_REST_API_URL` | (your existing value) |
| `KV_REST_API_TOKEN` | (your existing value) |

### Via Vercel CLI (Alternative):

```bash
# Set all at once
vercel env add DATABASE_URI production
vercel env add PAYLOAD_SECRET production
vercel env add NEXT_PUBLIC_SERVER_URL production
vercel env add BLOB_READ_WRITE_TOKEN production
vercel env add AI_AGENT_API_KEY production
vercel env add ANTHROPIC_API_KEY production
```

---

## Step 5: Push Code to Trigger Deployment

```bash
git add -A
git commit -m "Fix Vercel deployment configuration for Payload CMS"
git push origin claude/landing-page-audit-redesign-011CUcDcLyjwt99g9oUnpCHK
```

Vercel will automatically detect the push and start building.

---

## Step 6: Run Database Migrations (AFTER First Deploy)

Once the build succeeds and deployment is live:

### Option A: Via Vercel CLI (Recommended)

```bash
# Pull environment variables locally
vercel env pull .env.production

# Run migration against production database
npm run migrate
```

### Option B: Via Local Script

```bash
# Set DATABASE_URI to production value
export DATABASE_URI="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb"

# Run migration
npm run migrate
```

This will create all database tables:
- `users` (admin authentication)
- `posts` (blog articles)
- `media` (images/files)
- `categories` (post categories)
- `authors` (article authors)
- `payload_preferences` (admin preferences)
- `payload_migrations` (migration tracking)

---

## Step 7: Create First Admin User

After deployment and migrations:

1. Go to **https://blosm.dev/admin**
2. Click **"Create your first user"**
3. Fill in:
   - **Name:** Your name
   - **Email:** Your email
   - **Password:** Secure password (min 8 chars)
   - **Role:** Admin
4. Click **Create**

---

## Step 8: Verify Deployment

### Test Admin Panel
- Visit: `https://blosm.dev/admin`
- Login with your credentials
- Create a test category
- Create a test blog post

### Test API Endpoints

```bash
# List posts
curl https://blosm.dev/api/blog

# Create post via AI agent
curl -X POST https://blosm.dev/api/blog \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-ai-agent-api-key" \
  -d '{
    "title": "Test Article",
    "slug": "test-article",
    "excerpt": "Test excerpt",
    "content": {"root": {"children": [], "type": "root"}},
    "status": "draft"
  }'
```

### Test Static Pages
- Homepage: `https://blosm.dev/`
- Examples: `https://blosm.dev/examples`

All existing pages should still work!

---

## Troubleshooting

### Build Fails: "Cannot connect to Postgres"

**Cause:** Environment variables not set in Vercel

**Fix:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `DATABASE_URI` for Production, Preview, and Development
3. Redeploy: `vercel --prod` or push to GitHub

### Build Fails: "PAYLOAD_SECRET is required"

**Cause:** Missing PAYLOAD_SECRET

**Fix:**
1. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Add to Vercel environment variables
3. Redeploy

### Admin Panel Shows 500 Error

**Cause:** Database migrations not run

**Fix:**
```bash
npm run migrate
```

### Media Upload Fails

**Cause:** BLOB_READ_WRITE_TOKEN not set or invalid

**Fix:**
1. Go to Vercel → Storage → Blob → .env.local
2. Copy token
3. Update environment variable in Vercel
4. Redeploy

### API Returns "Unauthorized"

**Cause:** AI_AGENT_API_KEY mismatch

**Fix:**
1. Check environment variable in Vercel
2. Use same key in API requests: `x-api-key: ai_xxx`

---

## Production Checklist

Before going live:

- [ ] All environment variables set in Vercel (Production + Preview)
- [ ] Neon database created and connection string added
- [ ] Vercel Blob storage created and token added
- [ ] Deployment successful (green checkmark in Vercel)
- [ ] Database migrations completed
- [ ] First admin user created
- [ ] Admin panel accessible at `/admin`
- [ ] Test blog post created and published
- [ ] API endpoints responding (`/api/blog`)
- [ ] Existing static pages working (`/`, `/examples`)
- [ ] DNS configured (if using custom domain)

---

## Next Steps After Deployment

1. **Create Content Structure:**
   - Add categories (Website Modernization, SEO, Design, etc.)
   - Add author profiles
   - Create first 5-10 blog posts

2. **Build Blog Frontend:**
   - Blog listing page (`/blog`)
   - Article detail pages (`/blog/[slug]`)
   - Category pages (`/blog/category/[slug]`)

3. **Set Up AI Article Generation:**
   - Build Claude Agent SDK integration
   - Test automated article creation
   - Set up review workflow

4. **SEO Optimization:**
   - Add Open Graph tags
   - Generate sitemap
   - Submit to Google Search Console

---

## Monitoring & Maintenance

### Vercel Dashboard
- Monitor build logs
- Check function execution
- Review analytics

### Database
- Neon dashboard: Monitor usage
- Free tier: 0.5 GB storage
- Upgrade if needed

### Storage
- Vercel Blob: Monitor usage
- Free tier: 100 GB bandwidth

---

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | Hobby (free) | Pro $20/month |
| **Neon** | 0.5 GB storage | $19/month (10 GB) |
| **Vercel Blob** | 100 GB bandwidth | $0.15/GB after |
| **Total** | $0 - $20/month | $20-40/month |

---

## Support

If you encounter issues:

1. **Check build logs** in Vercel dashboard
2. **Review environment variables** (Settings → Environment Variables)
3. **Check database connection** via Neon dashboard
4. **Review Payload docs:** https://payloadcms.com/docs

---

## Summary

Your deployment workflow:

```
1. Set environment variables in Vercel
2. Push code to GitHub
3. Vercel auto-deploys
4. Run migrations: npm run migrate
5. Create admin user at /admin
6. Start creating content!
```

**Ready to deploy? Push your changes and let Vercel do the rest!** 🚀
