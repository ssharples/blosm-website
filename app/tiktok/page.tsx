'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function TikTokContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')
  const accessToken = searchParams.get('access_token')
  const openId = searchParams.get('open_id')
  const refreshToken = searchParams.get('refresh_token')

  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('')

  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY
  const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI || 'https://blosm.dev/api/tiktok/callback'

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,video.upload,video.publish&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=blosm`

  const handleUpload = async () => {
    if (!accessToken || !videoUrl) return

    setUploading(true)
    setUploadResult(null)

    try {
      const response = await fetch('/api/tiktok/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          video_url: videoUrl,
        }),
      })

      const result = await response.json()
      setUploadResult(JSON.stringify(result, null, 2))
    } catch (err) {
      setUploadResult(`Error: ${err}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>🎵 TikTok Integration</h1>

      {error && (
        <div style={{ background: '#fee', padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && accessToken ? (
        <div>
          <div style={{ background: '#efe', padding: 16, borderRadius: 8, marginBottom: 20 }}>
            <strong>✅ Connected!</strong>
            <br />
            <small>Open ID: {openId}</small>
          </div>

          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 20 }}>
            <h3>Access Token (save this!):</h3>
            <textarea
              readOnly
              value={accessToken}
              style={{ width: '100%', height: 80, fontFamily: 'monospace', fontSize: 12 }}
            />
            {refreshToken && (
              <>
                <h3>Refresh Token:</h3>
                <textarea
                  readOnly
                  value={refreshToken}
                  style={{ width: '100%', height: 80, fontFamily: 'monospace', fontSize: 12 }}
                />
              </>
            )}
          </div>

          <h2>Upload Video</h2>
          <input
            type="text"
            placeholder="Video URL (public .mp4)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{ width: '100%', padding: 12, marginBottom: 12, fontSize: 16 }}
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !videoUrl}
            style={{
              background: '#fe2c55',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: 16,
              borderRadius: 8,
              cursor: uploading ? 'wait' : 'pointer',
            }}
          >
            {uploading ? 'Uploading...' : 'Upload to TikTok'}
          </button>

          {uploadResult && (
            <pre style={{ background: '#f0f0f0', padding: 16, marginTop: 20, overflow: 'auto' }}>
              {uploadResult}
            </pre>
          )}
        </div>
      ) : (
        <div>
          <p>Connect your TikTok account to enable video uploads.</p>
          <a
            href={authUrl}
            style={{
              display: 'inline-block',
              background: '#fe2c55',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 16,
            }}
          >
            Connect TikTok
          </a>
        </div>
      )}
    </div>
  )
}

export default function TikTokPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <TikTokContent />
    </Suspense>
  )
}
