'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Menu, X, ChevronDown } from './Icons'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blosm-darker/90 backdrop-blur-md border-b border-blosm-border-subtle">
      <div className="container-custom px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/blosm-logo-2.svg"
            alt="Blosm"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold text-blosm-text tracking-tight">
            Blosm
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              onBlur={() => setTimeout(() => setSolutionsOpen(false), 150)}
              className="text-blosm-text-muted hover:text-blosm-text transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              Solutions
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-3 w-60 bg-blosm-card border border-blosm-border rounded-xl shadow-2xl shadow-black/20 py-2 overflow-hidden">
                <Link
                  href="/solutions/staffing"
                  className="block px-4 py-2.5 text-blosm-text-muted hover:text-blosm-text hover:bg-blosm-card-hover transition-colors text-sm"
                >
                  <span className="font-medium text-blosm-text">Staffing Suite</span>
                  <p className="text-xs text-blosm-text-dim mt-0.5">Shifts, workers, payroll</p>
                </Link>
                <Link
                  href="/solutions/accreditation"
                  className="block px-4 py-2.5 text-blosm-text-muted hover:text-blosm-text hover:bg-blosm-card-hover transition-colors text-sm"
                >
                  <span className="font-medium text-blosm-text">Accreditation</span>
                  <p className="text-xs text-blosm-text-dim mt-0.5">Credentials, passes, access</p>
                </Link>
                <Link
                  href="/solutions/stock-management"
                  className="block px-4 py-2.5 text-blosm-text-muted hover:text-blosm-text hover:bg-blosm-card-hover transition-colors text-sm"
                >
                  <span className="font-medium text-blosm-text">Stock Management</span>
                  <p className="text-xs text-blosm-text-dim mt-0.5">Inventory, bar stock, equipment</p>
                </Link>
              </div>
            )}
          </div>

          <Link href="/case-study/chained-events" className="text-blosm-text-muted hover:text-blosm-text transition-colors text-sm font-medium">
            Case Study
          </Link>
          <Link href="/about" className="text-blosm-text-muted hover:text-blosm-text transition-colors text-sm font-medium">
            About
          </Link>
        </div>

        <Link href="/contact" className="hidden md:flex btn-primary text-sm py-2.5 px-5">
          Book a call
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-blosm-text hover:text-blosm-primary transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blosm-darker border-t border-blosm-border-subtle">
          <div className="container-custom px-6 py-6 space-y-6">
            <div className="space-y-1">
              <p className="text-xs text-blosm-text-dim uppercase tracking-wider font-medium mb-3">Solutions</p>
              <Link
                href="/solutions/staffing"
                className="block py-2.5 text-blosm-text-muted hover:text-blosm-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Staffing Suite
              </Link>
              <Link
                href="/solutions/accreditation"
                className="block py-2.5 text-blosm-text-muted hover:text-blosm-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accreditation
              </Link>
              <Link
                href="/solutions/stock-management"
                className="block py-2.5 text-blosm-text-muted hover:text-blosm-text transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stock Management
              </Link>
            </div>

            <div className="h-px bg-blosm-border-subtle" />

            <Link
              href="/case-study/chained-events"
              className="block py-2.5 text-blosm-text-muted hover:text-blosm-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Case Study
            </Link>
            <Link
              href="/about"
              className="block py-2.5 text-blosm-text-muted hover:text-blosm-text transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className="btn-primary text-sm py-2.5 px-5 inline-flex mt-2"
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
