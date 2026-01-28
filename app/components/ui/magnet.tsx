'use client'

import { useRef, useState, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagnetProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  disabled?: boolean
}

export function Magnet({
  children,
  className = '',
  strength = 0.3,
  radius = 100,
  disabled = false,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  // Respect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || prefersReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

    if (distance < radius) {
      x.set(distanceX * strength)
      y.set(distanceY * strength)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  if (disabled || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </motion.div>
  )
}
