'use client'

import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  splitBy?: 'chars' | 'words' | 'lines'
  animation?: 'fadeUp' | 'fadeIn' | 'slideUp' | 'reveal'
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

export function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  splitBy = 'chars',
  animation = 'fadeUp',
  as: Tag = 'span',
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  const elements = useMemo(() => {
    if (splitBy === 'words') {
      return text.split(' ').map((word, i) => ({ text: word, key: i }))
    }
    if (splitBy === 'lines') {
      return text.split('\n').map((line, i) => ({ text: line, key: i }))
    }
    // chars
    return text.split('').map((char, i) => ({ text: char === ' ' ? '\u00A0' : char, key: i }))
  }, [text, splitBy])

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    if (hasAnimated.current || !containerRef.current) return
    hasAnimated.current = true

    const spans = containerRef.current.querySelectorAll('.split-text-item')

    const getAnimation = () => {
      switch (animation) {
        case 'fadeIn':
          return { from: { opacity: 0 }, to: { opacity: 1 } }
        case 'slideUp':
          return { from: { y: '100%' }, to: { y: '0%' } }
        case 'reveal':
          return { from: { opacity: 0, rotationX: -90 }, to: { opacity: 1, rotationX: 0 } }
        case 'fadeUp':
        default:
          return { from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0 } }
      }
    }

    const { from, to } = getAnimation()

    gsap.set(spans, from)
    gsap.to(spans, {
      ...to,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
    })
  }, [animation, delay, duration, stagger])

  return (
    <Tag ref={containerRef as any} className={`inline ${className}`}>
      {elements.map(({ text: t, key }) => (
        <span
          key={key}
          className="split-text-item inline-block"
          style={{ opacity: 0 }}
        >
          {t}
          {splitBy === 'words' && key < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  )
}
