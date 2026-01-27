'use client'

import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagnetProps {
  children: ReactNode
  className?: string
  strength?: number
  range?: number
  disabled?: boolean
}

export function Magnet({
  children,
  className = '',
  strength = 0.3,
  range = 100,
  disabled = false,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    if (distance < range) {
      x.set(distanceX * strength)
      y.set(distanceY * strength)
      setIsHovered(true)
    } else {
      x.set(0)
      y.set(0)
      setIsHovered(false)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-hovered={isHovered}
    >
      {children}
    </motion.div>
  )
}
