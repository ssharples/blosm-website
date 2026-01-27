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
        className="absolute left-1/4 top-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px]"
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
        {/* Section Header - INTEREST (outcome-focused) */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-4 tracking-tight">
              Built to <span className="bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent">Win</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-light">
              Every line of code focused on one thing: helping your business grow
            </p>
          </ScrollReveal>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-6 auto-rows-fr">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon]
            
            // Bento grid sizing - asymmetric layout for visual interest
            const gridClasses = [
              'md:col-span-3', // Full-Stack - large
              'md:col-span-3', // React - large
              'md:col-span-2', // Backend - small
              'md:col-span-2', // Database - small
              'md:col-span-2', // Responsive - small
              'md:col-span-4', // Performance - wide
              'md:col-span-2', // AI - small
            ][index]
            
            const isLarge = index === 0 || index === 1 || index === 5
            
            return (
              <ScrollReveal key={service.id} delay={index * 0.08}>
                <SpotlightCard>
                  <div className={`relative p-6 lg:p-8 h-full min-h-[260px] bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-brand/30 ${gridClasses}`}>
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex items-center justify-center ${isLarge ? 'w-16 h-16' : 'w-14 h-14'} mb-6 rounded-xl bg-gradient-to-br from-brand/20 to-purple-600/20 border border-brand/30`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className={`${isLarge ? 'h-8 w-8' : 'h-7 w-7'} text-brand-light`} />
                    </motion.div>

                    {/* Content */}
                    <h3 className={`${isLarge ? 'text-2xl' : 'text-xl'} font-display font-bold text-white mb-3`}>
                      {service.name}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
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
