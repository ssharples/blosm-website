'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Calendar } from 'lucide-react'
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
          {/* Badge */}
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-gray-400">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Available for new projects
              </span>
            </motion.div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal delay={0.2}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to build something{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                amazing?
              </span>
            </h2>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={0.4}>
            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Whether you're a startup with a bold idea or an established business looking to modernize,
              let's talk about how we can help bring your vision to life.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Magnet strength={0.2} range={150}>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Get in Touch
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
                  href="/contact"
                  className="w-full sm:w-auto group px-8 py-4 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule a Call
                </Link>
              </Magnet>
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal delay={0.8}>
            <p className="text-sm text-gray-500">
              Or email directly at{' '}
              <a
                href={`mailto:${COMPANY.contact.email}`}
                className="text-pink-400 hover:text-pink-300 transition-colors underline"
              >
                {COMPANY.contact.email}
              </a>
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
