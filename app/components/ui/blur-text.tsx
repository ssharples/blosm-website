'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3'
}

export function BlurText({
  text,
  className = '',
  delay = 0,
  duration = 1,
  as: Tag = 'p',
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ref.current) {
        ref.current.style.opacity = '1'
        ref.current.style.filter = 'none'
      }
      return
    }

    if (hasAnimated.current || !ref.current) return
    hasAnimated.current = true

    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        filter: 'blur(10px)',
        y: 20,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
      }
    )
  }, [delay, duration])

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{ opacity: 0, filter: 'blur(10px)' }}
    >
      {text}
    </Tag>
  )
}
