'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { BlurText } from '../animations/blur-text'
import { GradientText } from '../animations/gradient-text'
import { ScrollReveal } from '../animations/scroll-reveal'
import { Magnet } from '../animations/magnet'
import { Aurora } from '../animations/aurora'
import { useRef } from 'react'
import { COMPANY } from '../../lib/constants'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Aurora Background */}
      <Aurora className="opacity-40" />

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Content Container with Parallax */}
      <motion.div
        className="container relative z-10 px-4 sm:px-6"
        style={{ opacity, scale, y }}
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-gray-400">
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              Bespoke web development solutions
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-[0.95]">
            <BlurText delay={0.4} animateBy="words" className="text-white">
              {COMPANY.tagline.split(' ').slice(0, -3).join(' ')}
            </BlurText>
            <br />
            <span className="block mt-2">
              <GradientText
                colors={['#ec4899', '#a855f7', '#3b82f6']}
                speed={4}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
              >
                {COMPANY.tagline.split(' ').slice(-3).join(' ')}
              </GradientText>
            </span>
          </h1>

          {/* Subheadline */}
          <ScrollReveal delay={0.8}>
            <p className="text-lg sm:text-xl mx-auto max-w-2xl text-gray-400 mb-8 sm:mb-12 px-4">
              {COMPANY.description}
            </p>
          </ScrollReveal>

          {/* CTA Buttons with Magnet Effect */}
          <ScrollReveal delay={1}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Magnet strength={0.2} range={150}>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%)',
                    }}
                  />
                </Link>
              </Magnet>
              <Magnet strength={0.2} range={150}>
                <Link
                  href="/case-studies"
                  className="w-full sm:w-auto px-8 py-4 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/5 transition-all duration-300"
                >
                  View Case Studies
                </Link>
              </Magnet>
            </div>
          </ScrollReveal>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.button
          className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll to content"
        >
          <span className="text-sm hidden sm:block">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </section>
  )
}
