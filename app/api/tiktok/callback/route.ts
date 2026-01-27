import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(
      new URL(`/tiktok?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/tiktok?error=No authorization code received', request.url)
    )
  }

  // Exchange code for access token
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || 'https://blosm.dev/api/tiktok/callback'

  try {
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(`/tiktok?error=${encodeURIComponent(tokenData.error.message || tokenData.error)}`, request.url)
      )
    }

    // Redirect to success page with token info (in production, store securely)
    const successUrl = new URL('/tiktok', request.url)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('access_token', tokenData.access_token)
    successUrl.searchParams.set('open_id', tokenData.open_id)
    if (tokenData.refresh_token) {
      successUrl.searchParams.set('refresh_token', tokenData.refresh_token)
    }

    return NextResponse.redirect(successUrl)
  } catch (err) {
    console.error('Token exchange error:', err)
    return NextResponse.redirect(
      new URL('/tiktok?error=Failed to exchange authorization code', request.url)
    )
  }
}
