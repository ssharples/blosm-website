'use client'

import { motion } from 'framer-motion'
import { CountUp } from '@/components/animations/count-up'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { STATS } from '@/lib/constants'
import { FolderCode, Award, Sparkles } from 'lucide-react'

const statIcons = [FolderCode, Award, Sparkles]

export function StatsBar() {
  return (
    <section className="relative py-16 sm:py-20 bg-black overflow-hidden">
      {/* Background with gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-600/5 to-blue-500/5" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />

      {/* Animated background glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15), transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
          {STATS.map((stat, index) => {
            const Icon = statIcons[index]

            return (
              <ScrollReveal key={stat.label} delay={index * 0.15}>
                <motion.div
                  className="text-center px-4 py-6 sm:py-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Icon */}
                  <motion.div
                    className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="h-5 w-5 text-pink-400" />
                  </motion.div>

                  {/* Number */}
                  <div className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2500} />
                  </div>

                  {/* Label */}
                  <div className="text-sm sm:text-base text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
