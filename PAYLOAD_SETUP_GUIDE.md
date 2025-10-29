# Payload CMS Setup Guide for Blosm
**Date:** October 29, 2025
**Status:** Installation Complete - Ready for Database Setup

---

## ✅ What's Been Installed

### 1. Core Dependencies
- ✅ **Payload CMS** v3.61.1 - Headless CMS
- ✅ **Next.js 15** - React framework
- ✅ **@payloadcms/db-postgres** - PostgreSQL adapter
- ✅ **@payloadcms/richtext-lexical** - Rich text editor
- ✅ **@payloadcms/storage-vercel-blob** - Media storage
- ✅ **TypeScript** - Type safety
- ✅ **Sharp** - Image processing
- ✅ **GraphQL** - API alternative

### 2. File Structure Created

```
blosm-website/
├── app/
│   ├── (payload)/
│   │   ├── admin/[[...segments]]/
│   │   │   └── page.tsx           # Admin panel route
│   │   ├── layout.tsx              # Admin layout
│   │   └── styles.css              # Admin styling
│   ├── api/
│   │   └── blog/
│   │       ├── route.ts            # GET/POST /api/blog
│   │       └── [slug]/route.ts     # GET /api/blog/[slug]
│   └── layout.tsx                  # Root layout
│
├── src/
│   └── collections/
│       ├── Posts.ts                # Blog posts collection
│       ├── Media.ts                # Images/files collection
│       ├── Categories.ts           # Post categories
│       ├── Authors.ts              # Article authors
│       └── Users.ts                # CMS admin users
│
├── payload.config.ts               # Main Payload configuration
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── .env.example                    # Environment variables template
└── package.json                    # Updated with Payload scripts
```

### 3. Content Collections Defined

#### **Posts Collection**
- Title, slug, excerpt
- Rich text content (Lexical editor)
- Author (relationship)
- Category (relationship)
- Tags array
- Featured image
- Auto-calculated read time
- SEO fields (title, description, keywords, OG image)
- Status (draft/published/archived)
- Published date
- AI generation tracking
- Draft versioning with auto-save

#### **Media Collection**
- Multiple image sizes (thumbnail, card, hero, og)
- Alt text (required for accessibility)
- Caption (optional)
- Focal point and cropping support

#### **Categories Collection**
- Name, slug, description
- Color coding

#### **Authors Collection**
- Name, email, bio, avatar
- Role/title
- Social links (Twitter, LinkedIn, GitHub)

#### **Users Collection** (Admin)
- Email/password authentication
- Roles: admin, editor, author

---

## 🎯 Next Steps: Database Setup

### Step 1: Create Neon Postgres Database

1. **Go to Neon.tech:** https://neon.tech
2. **Sign up/login** with GitHub or email
3. **Create a new project:**
   - Project name: `blosm-cms`
   - Region: Choose closest to your users
   - PostgreSQL version: 16 (default)
4. **Copy the connection string:**
   ```
   postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb
   ```

### Step 2: Create Vercel Blob Storage

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Navigate to Storage tab**
3. **Create new Blob store:**
   - Name: `blosm-media`
   - Region: Same as your deployment
4. **Copy the token** from `.env.local` tab

### Step 3: Set Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Payload CMS Configuration
DATABASE_URI=postgresql://user:password@your-neon-host.neon.tech/neondb
PAYLOAD_SECRET=your-super-secret-jwt-key-min-32-characters-long
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Vercel Blob Storage (for media uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx

# AI Agent API Key (for Claude Agent SDK)
AI_AGENT_API_KEY=your-secure-api-key-for-ai-agent

# Existing variables
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=hello@updates.blosm.dev
```

**Generate PAYLOAD_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Generate AI_AGENT_API_KEY:**
```bash
node -e "console.log('ai_' + require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Initialize Database

Run database migrations to create tables:

```bash
npm run payload migrate
```

This will:
- Connect to your Neon database
- Create all necessary tables
- Set up relationships
- Configure indexes

### Step 5: Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Step 6: Create First Admin User

1. Open browser: `http://localhost:3000/admin`
2. You'll see the Payload admin login screen
3. Click **"Create your first user"**
4. Fill in:
   - **Name:** Your name
   - **Email:** Your email
   - **Password:** Secure password (min 8 chars)
   - **Role:** Admin
5. Click **Create**

### Step 7: Explore Admin Panel

Navigate to different sections:
- **Posts** - Create blog articles
- **Media** - Upload images
- **Categories** - Create categories (e.g., "Website Modernization", "SEO", "Design")
- **Authors** - Add author profiles
- **Users** - Manage CMS users

---

## 📝 Creating Your First Blog Post

### Via Admin Panel (Manual)

1. Go to `http://localhost:3000/admin/collections/posts`
2. Click **"Create New"**
3. Fill in:
   - **Title:** "Welcome to Blosm Blog"
   - **Slug:** Auto-generated from title
   - **Excerpt:** Short summary (155 chars)
   - **Content:** Rich text content
   - **Category:** Select or create one
   - **Featured Image:** Upload an image
   - **SEO Title:** SEO-optimized title
   - **SEO Description:** Meta description
   - **Status:** Published
4. Click **Save**

### Via API (For Testing)

```bash
# Create a category first
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Modernization",
    "slug": "website-modernization",
    "description": "Articles about modernizing outdated websites",
    "color": "#7c3aed"
  }'

# Create a blog post
curl -X POST http://localhost:3000/api/blog \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-ai-agent-api-key" \
  -d '{
    "title": "10 Signs Your Website Needs Modernization",
    "slug": "website-needs-modernization",
    "excerpt": "Is your website showing its age? Here are 10 telltale signs that it's time for a refresh.",
    "content": {
      "root": {
        "children": [
          {
            "children": [
              {
                "detail": 0,
                "format": 0,
                "mode": "normal",
                "style": "",
                "text": "Your content here...",
                "type": "text",
                "version": 1
              }
            ],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "type": "paragraph",
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
      }
    },
    "category": "category-id-here",
    "status": "draft"
  }'
```

### View Your Post

```bash
# Get all posts
curl http://localhost:3000/api/blog

# Get specific post
curl http://localhost:3000/api/blog/website-needs-modernization
```

---

## 🤖 Claude Agent SDK Integration

### Create AI Article Generator

Create `/api/ai-agent/generate-article.ts`:

```typescript
import { Anthropic } from '@anthropic-ai/sdk'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.AI_AGENT_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, keywords, category } = await request.json()

    // 1. Initialize Claude
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // 2. Generate article content
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Write a comprehensive blog article about "${topic}" for a website modernization company.

Target keywords: ${keywords.join(', ')}
Category: ${category}

Requirements:
- Compelling title (60-70 characters)
- Meta description (150-160 characters)
- Introduction
- 3-5 main sections with H2 headings
- Actionable tips and examples
- Conclusion with CTA
- 1500-2000 words total

Return as JSON:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "... (plain text for now)",
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": "..."
  }
}`,
        },
      ],
    })

    const articleData = JSON.parse(message.content[0].text)

    // 3. Create Lexical content structure
    const lexicalContent = {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: articleData.content,
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }

    // 4. Create article in Payload
    const payload = await getPayloadHMR({ config })

    // Find or create category
    const categories = await payload.find({
      collection: 'categories',
      where: { slug: { equals: category } },
      limit: 1,
    })

    let categoryId = categories.docs[0]?.id

    if (!categoryId) {
      const newCategory = await payload.create({
        collection: 'categories',
        data: {
          name: category,
          slug: category,
        },
      })
      categoryId = newCategory.id
    }

    // Create post
    const article = await payload.create({
      collection: 'posts',
      data: {
        title: articleData.title,
        slug: articleData.slug,
        content: lexicalContent,
        excerpt: articleData.excerpt,
        category: categoryId,
        tags: keywords.map((k) => ({ tag: k })),
        seo: articleData.seo,
        status: 'draft', // Review before publishing
        generatedBy: 'ai',
      },
    })

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        editUrl: `http://localhost:3000/admin/collections/posts/${article.id}`,
      },
    })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

### Test AI Article Generation

```bash
curl -X POST http://localhost:3000/api/ai-agent/generate-article \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-ai-agent-api-key" \
  -d '{
    "topic": "Website Modernization Best Practices",
    "keywords": ["website modernization", "web design", "SEO"],
    "category": "website-modernization"
  }'
```

---

## 🚀 Deployment to Vercel

### Update vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env`:
   - `DATABASE_URI`
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SERVER_URL` (use your prod URL)
   - `BLOB_READ_WRITE_TOKEN`
   - `AI_AGENT_API_KEY`
   - `ANTHROPIC_API_KEY`
   - (existing variables)

### Deploy

```bash
npm run deploy
```

Or push to GitHub (if connected to Vercel).

### First Deployment

After first deployment:
1. Run migrations: `vercel env pull .env.production`
2. Then locally: `DATABASE_URI=production-url npm run payload migrate`

---

## 📊 Content Collections Reference

### Posts API Examples

**List all posts:**
```bash
GET /api/blog
GET /api/blog?page=2&limit=10
GET /api/blog?category=website-modernization
```

**Get single post:**
```bash
GET /api/blog/article-slug
```

**Create post (AI agent):**
```bash
POST /api/blog
Headers: { "x-api-key": "your-api-key" }
Body: { title, slug, content, excerpt, category, ... }
```

### Admin REST API

Payload automatically creates REST APIs for all collections:

```bash
# Posts
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PATCH  /api/posts/:id
DELETE /api/posts/:id

# Media
GET    /api/media
POST   /api/media (multipart/form-data)

# Categories
GET    /api/categories
POST   /api/categories

# Authors
GET    /api/authors
POST   /api/authors
```

### GraphQL API

GraphQL playground available at: `http://localhost:3000/api/graphql`

```graphql
query {
  Posts(where: { status: { equals: published } }, sort: "-publishedAt") {
    docs {
      id
      title
      slug
      excerpt
      publishedAt
      category {
        name
        slug
      }
      author {
        name
        email
      }
      featuredImage {
        url
        alt
      }
    }
  }
}
```

---

## 🎨 Customization

### Custom Fields

Add custom fields to any collection:

```typescript
// src/collections/Posts.ts
fields: [
  // ... existing fields
  {
    name: 'viewCount',
    type: 'number',
    defaultValue: 0,
    admin: {
      readOnly: true, // Auto-increment
    },
  },
  {
    name: 'relatedPosts',
    type: 'relationship',
    relationTo: 'posts',
    hasMany: true,
  },
]
```

### Custom Hooks

Add logic before/after save:

```typescript
hooks: {
  beforeChange: [
    ({ data }) => {
      // Auto-generate excerpt from content
      if (!data.excerpt && data.content) {
        const text = JSON.stringify(data.content)
        data.excerpt = text.substring(0, 155)
      }
      return data
    },
  ],
  afterChange: [
    async ({ doc }) => {
      // Send notification after publish
      if (doc.status === 'published') {
        await sendNotification(doc)
      }
    },
  ],
}
```

### Admin UI Customization

Edit `app/(payload)/styles.css`:

```css
:root {
  --blosm-purple: #7c3aed;
  --blosm-purple-light: #a78bfa;
}

/* Custom branding */
.payload-branding {
  background: linear-gradient(135deg, var(--blosm-purple) 0%, var(--blosm-purple-light) 100%);
}

/* Custom sidebar */
.payload-sidebar {
  background-color: #1a1a1a;
}
```

---

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Test connection
node -e "require('pg').Pool({connectionString: process.env.DATABASE_URI}).query('SELECT NOW()').then(console.log)"
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate types
npm run generate:types

# Rebuild
npm run build
```

### Migration Issues

```bash
# Reset database (WARNING: deletes all data)
npm run payload migrate:reset

# Create fresh migration
npm run payload migrate:create
```

---

## 📚 Resources

- **Payload Docs:** https://payloadcms.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Neon Postgres:** https://neon.tech/docs
- **Vercel Blob:** https://vercel.com/docs/storage/vercel-blob
- **Lexical Editor:** https://lexical.dev/docs

---

## ✅ Checklist

- [ ] Created Neon database
- [ ] Set up Vercel Blob storage
- [ ] Configured environment variables
- [ ] Ran database migrations
- [ ] Created first admin user
- [ ] Created sample category
- [ ] Created sample blog post
- [ ] Tested API endpoints
- [ ] Set up AI article generator
- [ ] Deployed to Vercel
- [ ] Configured production environment variables

---

## 🎯 Next: Build the Frontend

Once Payload is working, you can:

1. Create blog listing page (`/blog`)
2. Create article detail pages (`/blog/[slug]`)
3. Integrate with existing static site
4. Add SEO metadata
5. Build AI content generation workflow

Ready to proceed? Let me know if you hit any issues! 🚀
