'use client'

import { cn } from '@/lib/utils'

interface AuroraProps {
  className?: string
  colors?: string[]
}

export function Aurora({
  className,
  colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-primary)'],
}: AuroraProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* Primary aurora blob */}
      <div
        className="absolute -top-1/2 left-1/4 h-[800px] w-[800px] animate-float opacity-30 blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
          animationDuration: '8s',
        }}
      />
      {/* Secondary aurora blob */}
      <div
        className="absolute -bottom-1/4 right-1/4 h-[600px] w-[600px] animate-float opacity-20 blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
          animationDuration: '10s',
          animationDelay: '-3s',
        }}
      />
      {/* Tertiary aurora blob */}
      <div
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-float opacity-15 blur-[80px]"
        style={{
          background: `radial-gradient(circle, ${colors[2]} 0%, transparent 70%)`,
          animationDuration: '12s',
          animationDelay: '-6s',
        }}
      />
    </div>
  )
}
