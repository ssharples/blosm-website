'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
  decimals?: number
  separator?: string
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
  separator = ',',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(start)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(end)
      return
    }

    if (!ref.current) return

    const element = ref.current

    const ctx = gsap.context(() => {
      const obj = { value: start }

      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return
          hasAnimated.current = true

          gsap.to(obj, {
            value: end,
            duration,
            delay,
            ease: 'power2.out',
            onUpdate: () => {
              setDisplayValue(obj.value)
            },
          })
        },
      })
    })

    return () => ctx.revert()
  }, [end, start, duration, delay])

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals)
    const [whole, decimal] = fixed.split('.')
    const formatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return decimal ? `${formatted}.${decimal}` : formatted
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  )
}
