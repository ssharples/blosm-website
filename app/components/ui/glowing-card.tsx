'use client'

import { useRef, useState, ReactNode, useEffect } from 'react'

interface GlowingCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  borderRadius?: string
  as?: 'div' | 'a' | 'article'
  href?: string
}

export function GlowingCard({
  children,
  className = '',
  glowColor = 'rgba(167, 139, 250, 0.4)',
  borderRadius = '0.75rem',
  as: Tag = 'div',
  href,
}: GlowingCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  const props: any = {
    ref: cardRef,
    className: `relative overflow-hidden ${className}`,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    style: { borderRadius },
  }

  if (Tag === 'a' && href) {
    props.href = href
  }

  return (
    <Tag {...props}>
      {/* Glow effect */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
          }}
        />
      )}
      {/* Border glow */}
      {!prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.5 : 0,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 30%)`,
            mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
            borderRadius,
          }}
        />
      )}
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Tag>
  )
}
