'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/scroll-reveal'
import { SpotlightCard } from '@/components/animations/spotlight-card'
import { CASE_STUDIES } from '@/lib/constants'

export function CaseStudies() {
  return (
    <section className="relative py-20 sm:py-28 md:py-32 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />
      
      {/* Floating gradient orb */}
      <motion.div
        className="absolute right-1/4 top-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Recent <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Projects</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Real solutions for real businesses — from event management to e-commerce
            </p>
          </ScrollReveal>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CASE_STUDIES.map((study, index) => (
            <ScrollReveal key={study.id} delay={index * 0.2}>
              <SpotlightCard>
                <Link href={study.href}>
                  <div className="group relative h-full p-8 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                          {study.name}
                        </h3>
                        <p className="text-sm text-gray-500">{study.subtitle}</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {study.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {study.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {study.tech.length > 4 && (
                        <span className="px-3 py-1 text-xs font-medium text-gray-500">
                          +{study.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Results Preview */}
                    <div className="space-y-2 mb-6">
                      {study.results.slice(0, 2).map((result, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                          <span className="text-pink-500 mt-1">→</span>
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-pink-400 group-hover:gap-3 transition-all">
                      View Case Study
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>

        {/* View All Button */}
        <ScrollReveal delay={0.6}>
          <div className="text-center mt-12">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/5 transition-all duration-300"
            >
              View All Projects
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
