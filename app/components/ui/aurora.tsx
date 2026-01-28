'use client'

import { useEffect, useRef } from 'react'

interface AuroraProps {
  className?: string
  colors?: string[]
  speed?: number
  blur?: number
  opacity?: number
}

export function Aurora({
  className = '',
  colors = ['#a78bfa', '#8b5cf6', '#c4b5fd', '#7c3aed'],
  speed = 1,
  blur = 100,
  opacity = 0.3,
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const blobs = colors.map((color, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 200 + Math.random() * 200,
      color,
      speedX: (Math.random() - 0.5) * speed * 0.5,
      speedY: (Math.random() - 0.5) * speed * 0.5,
      phase: Math.random() * Math.PI * 2,
    }))

    const animate = () => {
      time += 0.01 * speed
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob, i) => {
        // Update position with gentle movement
        blob.x += Math.sin(time + blob.phase) * 0.5 * speed
        blob.y += Math.cos(time * 0.7 + blob.phase) * 0.5 * speed

        // Wrap around edges
        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius

        // Draw blob with gradient
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        )
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'transparent')

        ctx.globalAlpha = opacity
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [colors, speed, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ filter: `blur(${blur}px)` }}
    />
  )
}
