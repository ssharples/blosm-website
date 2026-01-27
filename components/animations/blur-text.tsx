'use client'

import { useRef } from 'react'
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
  const isInView = useInView(ref, { once: true, margin: '-100px', amount: 0.3 })
  
  const elements = animateBy === 'words' ? children.split(' ') : children.split('')

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: direction === 'bottom' ? 15 : -15,
    },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
          key={`${element}-${index}`}
          variants={itemVariants}
          className="inline-block whitespace-pre"
          style={{ marginRight: animateBy === 'words' && element !== ' ' ? '0.3em' : undefined }}
        >
          {element}
        </motion.span>
      ))}
    </motion.span>
  )
}
