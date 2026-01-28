'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'

interface InfiniteScrollProps {
  children: ReactNode
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
  gap?: number
}

export function InfiniteScroll({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  gap = 24,
}: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    if (!scrollerRef.current || !containerRef.current) return

    const scroller = scrollerRef.current
    const container = containerRef.current

    // Clone the content for seamless loop
    const content = scroller.innerHTML
    scroller.innerHTML = content + content

    const scrollWidth = scroller.scrollWidth / 2

    const xStart = direction === 'left' ? 0 : -scrollWidth
    const xEnd = direction === 'left' ? -scrollWidth : 0

    gsap.set(scroller, { x: xStart })

    animationRef.current = gsap.to(scroller, {
      x: xEnd,
      duration: scrollWidth / speed,
      ease: 'none',
      repeat: -1,
    })

    const handleMouseEnter = () => {
      if (pauseOnHover && animationRef.current) {
        animationRef.current.pause()
      }
    }

    const handleMouseLeave = () => {
      if (pauseOnHover && animationRef.current) {
        animationRef.current.play()
      }
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [speed, direction, pauseOnHover])

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
    >
      <div
        ref={scrollerRef}
        className="flex"
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>
    </div>
  )
}
