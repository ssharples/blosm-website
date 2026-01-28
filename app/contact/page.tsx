'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { AnimatedContent, SplitText, BlurText, Magnet, GlowingCard } from '../components/ui'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Users,
  BadgeCheck,
  Package,
} from '../components/Icons'

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    teamSize: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const subject = encodeURIComponent(`Blosm inquiry from ${formData.name} at ${formData.company}`)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nPhone: ${formData.phone}\nInterest: ${formData.interest}\nTeam Size: ${formData.teamSize}\n\nMessage:\n${formData.message}`
      )
      window.location.href = `mailto:hello@blosm.dev?subject=${subject}&body=${body}`

      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-12 px-6 bg-glow-top relative">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight">
              <SplitText
                text="Let's build something "
                splitBy="words"
                animation="fadeUp"
                delay={0.2}
                stagger={0.06}
              />
              <span className="text-gradient">
                <SplitText
                  text="that actually works"
                  splitBy="words"
                  animation="fadeUp"
                  delay={0.6}
                  stagger={0.06}
                />
              </span>
            </h1>
            <BlurText
              text="No pitch deck. No 6-month scoping. Just a conversation about what you need and how we can help."
              className="text-lg text-blosm-text-muted leading-relaxed block"
              delay={1}
              as="p"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section bg-blosm-darker pt-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <AnimatedContent animation="fadeUp" className="lg:col-span-3">
              <GlowingCard className="bg-blosm-card border border-blosm-border overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Get in touch</h2>

                  {formState === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 rounded-full bg-blosm-accent/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-blosm-accent" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Thanks for reaching out!</h3>
                      <p className="text-blosm-text-muted mb-6">
                        We&apos;ll get back to you within 24 hours. In the meantime, feel free to check
                        out our case study.
                      </p>
                      <Magnet strength={0.2} radius={100}>
                        <Link href="/case-study/chained-events" className="btn-secondary inline-flex">
                          Read case study
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Magnet>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          label="Your name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                        />
                        <FormField
                          label="Email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jane@company.com"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          label="Company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your company"
                        />
                        <FormField
                          label="Phone (optional)"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+44 123 456 7890"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-blosm-text mb-2">
                            What are you interested in?
                          </label>
                          <select
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-blosm-darker border border-blosm-border rounded-lg text-blosm-text focus:outline-none focus:border-blosm-primary transition-colors"
                          >
                            <option value="">Select an option</option>
                            <option value="staffing">Staffing Suite</option>
                            <option value="accreditation">Accreditation</option>
                            <option value="stock">Stock Management</option>
                            <option value="custom">Custom Solution</option>
                            <option value="all">Multiple / Not sure</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-blosm-text mb-2">
                            Team size
                          </label>
                          <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-blosm-darker border border-blosm-border rounded-lg text-blosm-text focus:outline-none focus:border-blosm-primary transition-colors"
                          >
                            <option value="">Select an option</option>
                            <option value="1-50">1-50 workers</option>
                            <option value="51-200">51-200 workers</option>
                            <option value="201-500">201-500 workers</option>
                            <option value="500+">500+ workers</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blosm-text mb-2">
                          Tell us about your needs
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 bg-blosm-darker border border-blosm-border rounded-lg text-blosm-text focus:outline-none focus:border-blosm-primary transition-colors resize-none"
                          placeholder="What problems are you trying to solve? What does your current setup look like?"
                        />
                      </div>

                      <Magnet strength={0.15} radius={200}>
                        <button
                          type="submit"
                          disabled={formState === 'submitting'}
                          className="btn-primary w-full justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {formState === 'submitting' ? (
                            <span className="flex items-center gap-2">
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-blosm-dark border-t-transparent rounded-full inline-block"
                              />
                              Sending...
                            </span>
                          ) : (
                            <>
                              Send message
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </Magnet>

                      {formState === 'error' && (
                        <p className="text-center text-blosm-accent text-sm">
                          Something went wrong. Please try again or email us directly at{' '}
                          <a href="mailto:hello@blosm.dev" className="underline">
                            hello@blosm.dev
                          </a>
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </GlowingCard>
            </AnimatedContent>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedContent animation="fadeUp" delay={0.1}>
                <h3 className="text-xl font-bold mb-6">Contact details</h3>
                <div className="space-y-4">
                  <ContactMethod
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value="hello@blosm.dev"
                    href="mailto:hello@blosm.dev"
                  />
                  <ContactMethod
                    icon={<MapPin className="w-5 h-5" />}
                    label="Location"
                    value="United Kingdom"
                  />
                </div>
              </AnimatedContent>

              <AnimatedContent animation="fadeUp" delay={0.2}>
                <h3 className="text-xl font-bold mb-6">What to expect</h3>
                <div className="space-y-4">
                  <ExpectationItem text="We'll respond within 24 hours" />
                  <ExpectationItem text="No sales pressure — just a conversation" />
                  <ExpectationItem text="We'll ask questions to understand your needs" />
                  <ExpectationItem text="If we're not the right fit, we'll tell you" />
                </div>
              </AnimatedContent>

              <AnimatedContent animation="fadeUp" delay={0.3}>
                <GlowingCard className="bg-blosm-card border border-blosm-border">
                  <div className="p-6">
                    <h3 className="font-bold mb-4">Our solutions</h3>
                    <div className="space-y-3">
                      <SolutionLink
                        icon={<Users className="w-4 h-4" />}
                        title="Staffing Suite"
                        href="/solutions/staffing"
                      />
                      <SolutionLink
                        icon={<BadgeCheck className="w-4 h-4" />}
                        title="Accreditation"
                        href="/solutions/accreditation"
                      />
                      <SolutionLink
                        icon={<Package className="w-4 h-4" />}
                        title="Stock Management"
                        href="/solutions/stock-management"
                      />
                    </div>
                  </div>
                </GlowingCard>
              </AnimatedContent>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <AnimatedContent animation="fadeUp">
              <h2 className="text-3xl font-bold text-center mb-12">Common questions</h2>
            </AnimatedContent>
            <div className="space-y-6">
              <AnimatedContent animation="fadeUp" delay={0}>
                <FAQItem
                  question="How much does it cost?"
                  answer="Every project is different, so we don't have a one-size-fits-all price list. We'll discuss your needs and give you a clear quote before any work begins. No surprises."
                />
              </AnimatedContent>
              <AnimatedContent animation="fadeUp" delay={0.1}>
                <FAQItem
                  question="How long does a typical project take?"
                  answer="It depends on scope, but we ship in phases so you start seeing value quickly. A basic staffing system might take 6-8 weeks to launch. More complex solutions take longer, but you'll see progress along the way."
                />
              </AnimatedContent>
              <AnimatedContent animation="fadeUp" delay={0.2}>
                <FAQItem
                  question="Do you offer ongoing support?"
                  answer="Yes. We don't disappear after launch. We offer ongoing support and can continue to evolve your system as your needs change."
                />
              </AnimatedContent>
              <AnimatedContent animation="fadeUp" delay={0.3}>
                <FAQItem
                  question="Can you integrate with our existing systems?"
                  answer="Usually, yes. We've integrated with various POS systems, payroll providers, and ticketing platforms. Let's talk about what you're using."
                />
              </AnimatedContent>
              <AnimatedContent animation="fadeUp" delay={0.4}>
                <FAQItem
                  question="What if I'm not sure what I need?"
                  answer="That's totally fine. We can start with a discovery session to understand your operation and help you figure out what would actually make a difference."
                />
              </AnimatedContent>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FormField({
  label,
  name,
  type,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string
  name: string
  type: string
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-blosm-text mb-2">
        {label}
        {required && <span className="text-blosm-accent ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-blosm-darker border border-blosm-border rounded-lg text-blosm-text placeholder:text-blosm-text-dim focus:outline-none focus:border-blosm-primary transition-colors"
      />
    </div>
  )
}

function ContactMethod({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-primary/10 flex items-center justify-center text-blosm-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-blosm-text-muted">{label}</p>
        <p className="text-blosm-text font-medium">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    )
  }

  return content
}

function ExpectationItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-blosm-accent flex-shrink-0" />
      <p className="text-blosm-text-muted">{text}</p>
    </div>
  )
}

function SolutionLink({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode
  title: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-blosm-text-muted hover:text-blosm-text transition-colors"
    >
      <div className="text-blosm-primary">{icon}</div>
      <span>{title}</span>
      <ArrowRight className="w-4 h-4 ml-auto" />
    </Link>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <GlowingCard className="bg-blosm-card border border-blosm-border">
      <div className="p-6">
        <h3 className="font-bold text-blosm-text mb-3">{question}</h3>
        <p className="text-blosm-text-muted leading-relaxed">{answer}</p>
      </div>
    </GlowingCard>
  )
}
