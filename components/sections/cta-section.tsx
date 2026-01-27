'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { ScrollReveal } from '../animations/scroll-reveal'
import { Magnet } from '../animations/magnet'
import { Aurora } from '../animations/aurora'
import { COMPANY } from '../../lib/constants'

export function CTASection() {
  return (
    <section className="relative py-32 sm:py-40 md:py-48 bg-black overflow-hidden">
      {/* Aurora Background */}
      <Aurora className="opacity-30" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Loss Aversion Badge */}
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-gray-400">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Taking new projects · Fast response time
              </span>
            </motion.div>
          </ScrollReveal>

          {/* ACTION Headline - Loss Aversion + Urgency */}
          <ScrollReveal delay={0.2}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight tracking-tight">
              Your Competitors Are{' '}
              <span className="bg-gradient-to-r from-brand via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Moving Fast
              </span>
            </h2>
          </ScrollReveal>

          {/* Anchoring - Show the value before CTA */}
          <ScrollReveal delay={0.4}>
            <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              While you're planning, they're shipping. Get from idea to live product in weeks with a developer
              who's shipped <span className="text-brand-light font-medium">50+ products</span> and served{' '}
              <span className="text-brand-light font-medium">160K+ users</span>.
            </p>
          </ScrollReveal>

          {/* ONE Clear CTA - ACTION */}
          <ScrollReveal delay={0.6}>
            <Magnet strength={0.2} range={150}>
              <Link
                href="/contact"
                className="inline-flex group relative overflow-hidden px-10 py-5 bg-gradient-to-r from-brand to-purple-600 rounded-lg font-semibold text-lg text-white hover:shadow-2xl hover:shadow-brand/50 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Mail className="mr-2 h-6 w-6" />
                  {COMPANY.primaryCTA}
                  <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%)',
                  }}
                />
              </Link>
            </Magnet>
          </ScrollReveal>

          {/* Trust Signals Below CTA */}
          <ScrollReveal delay={0.8}>
            <div className="space-y-2 mt-8">
              <p className="text-sm text-gray-400">
                Email:{' '}
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="text-brand-light hover:text-brand-light transition-colors underline"
                >
                  {COMPANY.contact.email}
                </a>
              </p>
              <p className="text-xs text-gray-600">
                No contracts · No minimum commitment · Fast, quality work
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
