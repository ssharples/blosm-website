'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface BlurTextProps {
  children: string
  delay?: number
  className?: string
  direction?: 'top' | 'bottom'
  animateBy?: 'words' | 'characters'
}

export function BlurText({
  children,
  delay = 0,
  className = '',
  direction = 'bottom',
  animateBy = 'words',
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [elements, setElements] = useState<string[]>([])

  useEffect(() => {
    if (animateBy === 'words') {
      setElements(children.split(' '))
    } else {
      setElements(children.split(''))
    }
  }, [children, animateBy])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: {
      filter: 'blur(12px)',
      opacity: 0,
      y: direction === 'bottom' ? 20 : -20,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
          style={{ marginRight: animateBy === 'words' ? '0.25em' : undefined }}
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </motion.span>
  )
}
