import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@/payload.config'

// GET /api/blog - List all published posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')

    const payload = await getPayloadHMR({ config })

    const query: any = {
      status: { equals: 'published' },
    }

    if (category) {
      query['category.slug'] = { equals: category }
    }

    const posts = await payload.find({
      collection: 'posts',
      where: query,
      sort: '-publishedAt',
      limit,
      page,
      depth: 2, // Include related data (author, category, media)
    })

    return NextResponse.json({
      success: true,
      posts: posts.docs,
      totalPages: posts.totalPages,
      totalDocs: posts.totalDocs,
      page: posts.page,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new post (for AI agent)
export async function POST(request: Request) {
  try {
    const payload = await getPayloadHMR({ config })
    const data = await request.json()

    // Verify API key for AI agent access
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.AI_AGENT_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const post = await payload.create({
      collection: 'posts',
      data: {
        ...data,
        status: data.status || 'draft', // Default to draft for review
        generatedBy: 'ai',
      },
    })

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
