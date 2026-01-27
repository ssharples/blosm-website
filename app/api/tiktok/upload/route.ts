import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { access_token, video_url, title } = await request.json()

    if (!access_token) {
      return NextResponse.json({ error: 'Missing access_token' }, { status: 400 })
    }

    if (!video_url) {
      return NextResponse.json({ error: 'Missing video_url' }, { status: 400 })
    }

    // Step 1: Initialize upload
    const initResponse = await fetch(
      'https://open.tiktokapis.com/v2/post/publish/video/init/',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_info: {
            title: title || 'Uploaded via Blosm',
            privacy_level: 'SELF_ONLY', // Start private, can change later
            disable_duet: false,
            disable_comment: false,
            disable_stitch: false,
          },
          source_info: {
            source: 'PULL_FROM_URL',
            video_url: video_url,
          },
        }),
      }
    )

    const initData = await initResponse.json()

    if (initData.error) {
      return NextResponse.json(
        { error: initData.error.message || 'Upload initialization failed', details: initData },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Video upload initiated',
      publish_id: initData.data?.publish_id,
      data: initData,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: 'Upload failed', details: String(err) },
      { status: 500 }
    )
  }
}
