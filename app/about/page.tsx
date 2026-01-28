import { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '../components/Navigation'
import { Footer } from '../components/Footer'
import {
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Target,
  Clock,
  HeartHandshake,
} from '../components/Icons'

export const metadata: Metadata = {
  title: 'About Us | Blosm',
  description: 'We build software for the event industry. Not as consultants, but as people who\'ve run the ops ourselves. We know what breaks on show day.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-6 bg-glow-top relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              We&apos;ve been in the{' '}
              <span className="text-gradient">production office at 2am</span>
            </h1>
            <p className="text-xl text-blosm-text-muted leading-relaxed">
              We build software for the event industry — not as consultants looking in from the
              outside, but as people who&apos;ve lived the chaos and know what actually works when
              things get real.
            </p>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blosm-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blosm-accent/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Story Section */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                Our Story
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Born from real event operations
              </h2>
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
            </div>
            <div className="relative">
              <div className="aspect-square bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blosm-primary/20 to-blosm-accent/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl font-bold text-gradient">B</span>
                  </div>
                  <p className="text-2xl font-bold text-blosm-text mb-2">Blosm</p>
                  <p className="text-blosm-text-muted">Software for the event industry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Events */}
      <section className="section bg-blosm-dark bg-grid">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              Why Events?
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Because generic software{' '}
              <span className="text-blosm-highlight">doesn&apos;t cut it</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ReasonCard
              title="Events are different"
              description="Last-minute changes are the norm, not the exception. Your software needs to handle chaos gracefully, not fight against it."
            />
            <ReasonCard
              title="Generic tools fail"
              description="Off-the-shelf HR software doesn't understand shifts. Inventory systems don't survive a busy Saturday. You end up patching gaps with spreadsheets."
            />
            <ReasonCard
              title="Details matter"
              description="The difference between a smooth show day and a disaster often comes down to whether the right information reached the right person at the right time."
            />
            <ReasonCard
              title="People deserve better"
              description="Event workers and operators are some of the most adaptable people around. They shouldn't have to adapt to bad software too."
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              How We Work
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What you can expect from us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Target className="w-6 h-6" />}
              title="No fluff"
              description="We build what you need, not what looks good in a demo. Every feature earns its place."
            />
            <ValueCard
              icon={<Zap className="w-6 h-6" />}
              title="Fast delivery"
              description="No 18-month projects. We ship in phases so you start seeing value quickly."
            />
            <ValueCard
              icon={<HeartHandshake className="w-6 h-6" />}
              title="Real partnership"
              description="We stick around after launch. Your success is our success."
            />
            <ValueCard
              icon={<Clock className="w-6 h-6" />}
              title="Event-time support"
              description="We understand that problems don't wait until Monday morning."
            />
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
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
        </div>
      </section>

      {/* Approach */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                Our Approach
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                We start with understanding
              </h2>
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
            </div>
            <div>
              <div className="space-y-4">
                <ApproachStep
                  number="01"
                  title="Discovery"
                  description="We learn your operation inside and out"
                />
                <ApproachStep
                  number="02"
                  title="Design"
                  description="We plan a system that fits your reality"
                />
                <ApproachStep
                  number="03"
                  title="Build"
                  description="We deliver in phases so you see progress"
                />
                <ApproachStep
                  number="04"
                  title="Launch"
                  description="We train your team and support the transition"
                />
                <ApproachStep
                  number="05"
                  title="Evolve"
                  description="We stick around and keep improving"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-blosm-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blosm-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Let&apos;s talk about{' '}
              <span className="text-gradient">what you need</span>
            </h2>
            <p className="text-xl text-blosm-text-muted mb-10">
              No pitch deck required. Just a conversation about your operation and how we might
              help.
            </p>
            <Link href="/contact" className="btn-primary text-lg inline-flex">
              Get in touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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
    <div className="p-8 bg-blosm-card border border-blosm-border rounded-2xl">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-blosm-text-muted leading-relaxed">{description}</p>
    </div>
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
        <span className="text-blosm-highlight text-sm">✕</span>
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
    <div className="flex gap-4 items-start p-4 bg-blosm-card border border-blosm-border rounded-xl">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blosm-primary/10 border border-blosm-primary/20 flex items-center justify-center">
        <span className="text-blosm-primary font-bold text-sm">{number}</span>
      </div>
      <div>
        <h4 className="font-bold text-blosm-text mb-1">{title}</h4>
        <p className="text-blosm-text-muted text-sm">{description}</p>
      </div>
    </div>
  )
}
