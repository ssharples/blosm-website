'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X, ChevronDown } from './Icons'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blosm-darker/80 backdrop-blur-lg border-b border-blosm-border">
      <div className="container-custom px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gradient">
          Blosm
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              onBlur={() => setTimeout(() => setSolutionsOpen(false), 150)}
              className="text-blosm-text-muted hover:text-blosm-text transition-colors flex items-center gap-1"
            >
              Solutions
              <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-blosm-card border border-blosm-border rounded-lg shadow-xl py-2">
                <Link
                  href="/solutions/staffing"
                  className="block px-4 py-2 text-blosm-text-muted hover:text-blosm-text hover:bg-blosm-card-hover transition-colors"
                >
                  Staffing Suite
                </Link>
                <Link
                  href="/solutions/accreditation"
                  className="block px-4 py-2 text-blosm-text-muted hover:text-blosm-text hover:bg-blosm-card-hover transition-colors"
                >
                  Accreditation
                </Link>
                <Link
                  href="/solutions/stock-management"
                  className="block px-4 py-2 text-blosm-text-muted hover:text-blosm-text hover:bg-blosm-card-hover transition-colors"
                >
                  Stock Management
                </Link>
              </div>
            )}
          </div>

          <Link href="/case-study/chained-events" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
            Case Study
          </Link>
          <Link href="/about" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
            About
          </Link>
        </div>

        <Link href="/contact" className="hidden md:flex btn-primary text-sm py-2 px-4">
          Book a call
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-blosm-text"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blosm-darker border-t border-blosm-border">
          <div className="container-custom px-6 py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-blosm-text-dim uppercase tracking-wide">Solutions</p>
              <Link
                href="/solutions/staffing"
                className="block py-2 text-blosm-text-muted hover:text-blosm-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Staffing Suite
              </Link>
              <Link
                href="/solutions/accreditation"
                className="block py-2 text-blosm-text-muted hover:text-blosm-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accreditation
              </Link>
              <Link
                href="/solutions/stock-management"
                className="block py-2 text-blosm-text-muted hover:text-blosm-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stock Management
              </Link>
            </div>
            <Link
              href="/case-study/chained-events"
              className="block py-2 text-blosm-text-muted hover:text-blosm-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Case Study
            </Link>
            <Link
              href="/about"
              className="block py-2 text-blosm-text-muted hover:text-blosm-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="btn-primary text-sm py-2 px-4 inline-flex mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book a call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
