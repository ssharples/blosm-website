'use client'

import Link from 'next/link'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import { AnimatedContent, SplitText, BlurText, Magnet, GlowingCard } from '../components/ui'
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Target,
  Clock,
  HeartHandshake,
} from '../components/Icons'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 bg-glow-top relative">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight">
              <SplitText
                text="We've been in the "
                splitBy="words"
                animation="fadeUp"
                delay={0.2}
                stagger={0.06}
              />
              <span className="text-gradient">
                <SplitText
                  text="production office at 2am"
                  splitBy="words"
                  animation="fadeUp"
                  delay={0.6}
                  stagger={0.06}
                />
              </span>
            </h1>
            <BlurText
              text="We build software for the event industry — not as consultants looking in from the outside, but as people who've lived the chaos and know what actually works when things get real."
              className="text-lg text-blosm-text-muted leading-relaxed block"
              delay={1}
              as="p"
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedContent animation="fadeUp">
                <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                  Our Story
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Born from real event operations
                </h2>
              </AnimatedContent>
              <AnimatedContent animation="fadeUp" delay={0.1}>
                <div className="space-y-6 text-lg text-blosm-text-muted leading-relaxed">
                  <p>
                    Blosm didn&apos;t start with a pitch deck. It started in the production office,
                    watching talented operations teams waste hours on spreadsheets and WhatsApp groups
                    that weren&apos;t built for the reality of event work.
                  </p>
                  <p>
                    We saw staffing agencies tracking 400+ workers in Excel. We saw stock counts
                    getting lost on paper. We saw the same questions getting asked over and over
                    because important information was buried in group chats.
                  </p>
                  <p>
                    So we started building. Not generic business software with &quot;event mode&quot; bolted
                    on, but systems designed from day one for how events actually work — with all
                    their chaos, last-minute changes, and 2am crises.
                  </p>
                </div>
              </AnimatedContent>
            </div>
            <AnimatedContent animation="fadeLeft" delay={0.2}>
              <div className="relative">
                <GlowingCard className="bg-blosm-card border border-blosm-border overflow-hidden">
                  <div className="aspect-square flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blosm-primary/20 to-blosm-accent/20 flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl font-bold text-gradient">B</span>
                      </div>
                      <p className="text-2xl font-bold text-blosm-text mb-2">Blosm</p>
                      <p className="text-blosm-text-muted">Software for the event industry</p>
                    </div>
                  </div>
                </GlowingCard>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Why Events */}
      <section className="section bg-blosm-dark bg-grid">
        <div className="container-custom">
          <AnimatedContent animation="fadeUp">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                Why Events?
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Because generic software{' '}
                <span className="text-blosm-accent">doesn&apos;t cut it</span>
              </h2>
            </div>
          </AnimatedContent>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedContent animation="fadeUp" delay={0}>
              <ReasonCard
                title="Events are different"
                description="Last-minute changes are the norm, not the exception. Your software needs to handle chaos gracefully, not fight against it."
              />
            </AnimatedContent>
            <AnimatedContent animation="fadeUp" delay={0.1}>
              <ReasonCard
                title="Generic tools fail"
                description="Off-the-shelf HR software doesn't understand shifts. Inventory systems don't survive a busy Saturday. You end up patching gaps with spreadsheets."
              />
            </AnimatedContent>
            <AnimatedContent animation="fadeUp" delay={0.2}>
              <ReasonCard
                title="Details matter"
                description="The difference between a smooth show day and a disaster often comes down to whether the right information reached the right person at the right time."
              />
            </AnimatedContent>
            <AnimatedContent animation="fadeUp" delay={0.3}>
              <ReasonCard
                title="People deserve better"
                description="Event workers and operators are some of the most adaptable people around. They shouldn't have to adapt to bad software too."
              />
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <AnimatedContent animation="fadeUp">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                How We Work
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                What you can expect from us
              </h2>
            </div>
          </AnimatedContent>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedContent animation="fadeUp" delay={0}>
              <ValueCard
                icon={<Target className="w-6 h-6" />}
                title="No fluff"
                description="We build what you need, not what looks good in a demo. Every feature earns its place."
              />
            </AnimatedContent>
            <AnimatedContent animation="fadeUp" delay={0.1}>
              <ValueCard
                icon={<Zap className="w-6 h-6" />}
                title="Fast delivery"
                description="No 18-month projects. We ship in phases so you start seeing value quickly."
              />
            </AnimatedContent>
            <AnimatedContent animation="fadeUp" delay={0.2}>
              <ValueCard
                icon={<HeartHandshake className="w-6 h-6" />}
                title="Real partnership"
                description="We stick around after launch. Your success is our success."
              />
            </AnimatedContent>
            <AnimatedContent animation="fadeUp" delay={0.3}>
              <ValueCard
                icon={<Clock className="w-6 h-6" />}
                title="Event-time support"
                description="We understand that problems don't wait until Monday morning."
              />
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <AnimatedContent animation="fadeUp">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                What we don&apos;t do
              </h2>
              <div className="bg-blosm-card border border-blosm-border rounded-2xl p-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <DontDoItem text="6-month discovery phases" />
                  <DontDoItem text="Features you'll never use" />
                  <DontDoItem text="Ghost you after launch" />
                  <DontDoItem text="Force you into our way of working" />
                  <DontDoItem text="Charge for every small change" />
                  <DontDoItem text="Build things we don't understand" />
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Approach */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedContent animation="fadeUp">
                <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                  Our Approach
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  We start with understanding
                </h2>
              </AnimatedContent>
              <AnimatedContent animation="fadeUp" delay={0.1}>
                <div className="space-y-6 text-blosm-text-muted leading-relaxed">
                  <p>
                    Before we write a line of code, we need to understand your operation. Not just
                    what you want the software to do, but why — and what happens when it doesn&apos;t
                    work perfectly.
                  </p>
                  <p>
                    We ask annoying questions. We want to know about your worst show day. We want to
                    see your messy spreadsheets. We want to understand the workarounds your team has
                    invented because nothing else quite fits.
                  </p>
                  <p>
                    Then we build something that actually works for you. Not a demo that looks
                    impressive but falls apart in production. Real software that survives contact with
                    real events.
                  </p>
                </div>
              </AnimatedContent>
            </div>
            <div>
              <div className="space-y-4">
                <AnimatedContent animation="fadeUp" delay={0}>
                  <ApproachStep
                    number="01"
                    title="Discovery"
                    description="We learn your operation inside and out"
                  />
                </AnimatedContent>
                <AnimatedContent animation="fadeUp" delay={0.1}>
                  <ApproachStep
                    number="02"
                    title="Design"
                    description="We plan a system that fits your reality"
                  />
                </AnimatedContent>
                <AnimatedContent animation="fadeUp" delay={0.2}>
                  <ApproachStep
                    number="03"
                    title="Build"
                    description="We deliver in phases so you see progress"
                  />
                </AnimatedContent>
                <AnimatedContent animation="fadeUp" delay={0.3}>
                  <ApproachStep
                    number="04"
                    title="Launch"
                    description="We train your team and support the transition"
                  />
                </AnimatedContent>
                <AnimatedContent animation="fadeUp" delay={0.4}>
                  <ApproachStep
                    number="05"
                    title="Evolve"
                    description="We stick around and keep improving"
                  />
                </AnimatedContent>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <AnimatedContent animation="fadeUp">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
                Let&apos;s talk about{' '}
                <span className="text-gradient">what you need</span>
              </h2>
              <p className="text-lg text-blosm-text-muted mb-8">
                No pitch deck required. Just a conversation about your operation and how we might
                help.
              </p>
              <Magnet strength={0.2} radius={150}>
                <Link href="/contact" className="btn-primary inline-flex">
                  Get in touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Magnet>
            </div>
          </AnimatedContent>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ReasonCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <GlowingCard className="h-full bg-blosm-card border border-blosm-border">
      <div className="p-8">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-blosm-text-muted leading-relaxed">{description}</p>
      </div>
    </GlowingCard>
  )
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="icon-box mx-auto mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-blosm-text-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function DontDoItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-blosm-highlight/10 flex items-center justify-center flex-shrink-0">
        <span className="text-blosm-accent text-sm">✕</span>
      </div>
      <p className="text-blosm-text-muted">{text}</p>
    </div>
  )
}

function ApproachStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <GlowingCard className="bg-blosm-card border border-blosm-border">
      <div className="flex gap-4 items-start p-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blosm-primary/10 border border-blosm-primary/20 flex items-center justify-center">
          <span className="text-blosm-primary font-bold text-sm">{number}</span>
        </div>
        <div>
          <h4 className="font-bold text-blosm-text mb-1">{title}</h4>
          <p className="text-blosm-text-muted text-sm">{description}</p>
        </div>
      </div>
    </GlowingCard>
  )
}
