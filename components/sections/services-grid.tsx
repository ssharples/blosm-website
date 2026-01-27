'use client'

import { motion } from 'framer-motion'
import { 
  Layers, 
  Zap, 
  Server, 
  Database, 
  Smartphone, 
  Gauge, 
  Brain,
  LucideIcon 
} from 'lucide-react'
import { ScrollReveal } from '../animations/scroll-reveal'
import { SpotlightCard } from '../animations/spotlight-card'
import { SERVICES } from '../../lib/constants'

const iconMap: Record<string, LucideIcon> = {
  Layers,
  Zap,
  Server,
  Database,
  Smartphone,
  Gauge,
  Brain,
}

export function ServicesGrid() {
  return (
    <section className="relative py-20 sm:py-28 md:py-32 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      
      {/* Floating gradient orb */}
      <motion.div
        className="absolute left-1/4 top-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              What We <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Build</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From concept to deployment, we handle every aspect of modern web development
            </p>
          </ScrollReveal>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon]
            
            return (
              <ScrollReveal key={service.id} delay={index * 0.1}>
                <SpotlightCard>
                  <div className="relative p-8 h-full bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 backdrop-blur-sm">
                    {/* Icon */}
                    <motion.div
                      className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="h-7 w-7 text-pink-400" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
