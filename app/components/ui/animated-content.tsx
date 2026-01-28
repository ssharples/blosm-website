'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedContentProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  animation?: 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur'
  start?: string
  stagger?: number
  staggerChildren?: boolean
}

export function AnimatedContent({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  animation = 'fadeUp',
  start = 'top 85%',
  stagger = 0.1,
  staggerChildren = false,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (ref.current) {
        ref.current.style.opacity = '1'
        ref.current.style.transform = 'none'
        ref.current.style.filter = 'none'
      }
      return
    }

    if (!ref.current) return

    const element = ref.current
    const targets = staggerChildren ? element.children : element

    const getAnimation = () => {
      switch (animation) {
        case 'fadeIn':
          return { from: { opacity: 0 }, to: { opacity: 1 } }
        case 'fadeLeft':
          return { from: { opacity: 0, x: -40 }, to: { opacity: 1, x: 0 } }
        case 'fadeRight':
          return { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0 } }
        case 'scale':
          return { from: { opacity: 0, scale: 0.9 }, to: { opacity: 1, scale: 1 } }
        case 'blur':
          return { from: { opacity: 0, filter: 'blur(10px)' }, to: { opacity: 1, filter: 'blur(0px)' } }
        case 'fadeUp':
        default:
          return { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } }
      }
    }

    const { from, to } = getAnimation()

    gsap.set(targets, from)

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        ...to,
        duration,
        delay,
        stagger: staggerChildren ? stagger : 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [animation, delay, duration, start, stagger, staggerChildren])

  const initialStyles = {
    opacity: 0,
    ...(animation === 'fadeUp' && { transform: 'translateY(40px)' }),
    ...(animation === 'fadeLeft' && { transform: 'translateX(-40px)' }),
    ...(animation === 'fadeRight' && { transform: 'translateX(40px)' }),
    ...(animation === 'scale' && { transform: 'scale(0.9)' }),
    ...(animation === 'blur' && { filter: 'blur(10px)' }),
  }

  return (
    <div ref={ref} className={className} style={initialStyles}>
      {children}
    </div>
  )
}
