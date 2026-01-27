'use client'

import { cn } from '@/lib/utils'

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
  colors = ['#4BA3D3', '#D82E8A', '#4BA3D3'],
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
