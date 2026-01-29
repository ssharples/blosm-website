'use client'

import { cn } from '../../lib/utils'

// Default gradient using CSS variables (primary → accent → primary)
const DEFAULT_GRADIENT_COLORS = [
  'var(--primary, #4BA3D3)',
  'var(--accent, #D82E8A)',
  'var(--primary, #4BA3D3)',
]

// Brand gradient (purple tones)
export const BRAND_GRADIENT_COLORS = [
  'var(--brand, #a78bfa)',
  'var(--brand-dark, #8b5cf6)',
  'var(--brand-light, #c4b5fd)',
]

interface GradientTextProps {
  children: string
  className?: string
  colors?: string[]
  speed?: number
  animated?: boolean
}

export function GradientText({
  children,
  className = '',
  colors = DEFAULT_GRADIENT_COLORS,
  speed = 3,
  animated = true,
}: GradientTextProps) {
  const gradientString = colors.join(', ')

  return (
    <span
      className={cn('inline-block bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientString})`,
        backgroundSize: animated ? '200% 100%' : '100% 100%',
        animation: animated ? `gradient-flow ${speed}s ease infinite` : 'none',
        WebkitBackgroundClip: 'text',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient-flow {
          0% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
          }
        }
      `}</style>
    </span>
  )
}
