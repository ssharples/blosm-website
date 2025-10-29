import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Import collections
import { Posts } from './src/collections/Posts'
import { Media } from './src/collections/Media'
import { Categories } from './src/collections/Categories'
import { Authors } from './src/collections/Authors'
import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Server configuration
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  // Admin panel configuration
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Blosm CMS',
      favicon: '/images/logo.svg',
      ogImage: '/images/og-image.jpg',
    },
  },

  // Collections
  collections: [Posts, Media, Categories, Authors, Users],

  // Rich text editor
  editor: lexicalEditor({}),

  // Database adapter (PostgreSQL via Neon)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    // Push database schema on dev
    push: process.env.NODE_ENV !== 'production',
  }),

  // Secret for JWT tokens
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-this',

  // TypeScript output
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // GraphQL configuration
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },

  // Plugins
  plugins: [
    // Vercel Blob Storage for media uploads
    vercelBlobStorage({
      enabled: process.env.BLOB_READ_WRITE_TOKEN ? true : false,
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  // Sharp for image processing
  sharp,

  // CORS settings for API
  cors: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),

  // CSRF protection
  csrf: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),
})
