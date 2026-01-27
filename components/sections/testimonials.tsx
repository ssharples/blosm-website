'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { ScrollReveal } from '../animations/scroll-reveal'
import { SpotlightCard } from '../animations/spotlight-card'
import { TESTIMONIALS } from '../../lib/constants'

export function Testimonials() {
  return (
    <section className="relative py-20 sm:py-28 md:py-32 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      {/* Floating gradient orbs */}
      <motion.div
        className="absolute left-1/3 bottom-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative z-10">
        {/* Section Header - DESIRE (social proof) */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-4 tracking-tight">
              What Our <span className="bg-gradient-to-r from-purple-500 to-brand-dark bg-clip-text text-transparent">Clients Say</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Real feedback from founders and CTOs who chose to build with us
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal key={index} delay={index * 0.15}>
              <SpotlightCard>
                <div className="relative h-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 backdrop-blur-sm">
                  {/* Quote Icon */}
                  <motion.div
                    className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-brand-dark/20 border border-purple-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Quote className="h-6 w-6 text-purple-400" />
                  </motion.div>

                  {/* Quote */}
                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="font-semibold text-white mb-1">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
