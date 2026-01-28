import { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '../../components/Navigation'
import { Footer } from '../../components/Footer'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Users,
  Monitor,
  Smartphone,
  Package,
  Clock,
  MapPin,
  Quote,
  Zap,
  TrendingUp,
} from '../../components/Icons'

export const metadata: Metadata = {
  title: 'Chained Events Case Study | Blosm',
  description: 'How we transformed a growing staffing agency from spreadsheets and group chats to a unified platform managing 400+ workers across 3 venues.',
}

export default function ChainedEventsCaseStudy() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 bg-glow-top relative">
        <div className="container-custom relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blosm-text-muted hover:text-blosm-text transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <p className="text-blosm-primary font-medium mb-3 uppercase tracking-wide text-xs">
            Case Study
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight max-w-4xl">
            How Chained Events went from{' '}
            <span className="text-gradient">spreadsheet chaos</span> to one unified platform
          </h1>
          <p className="text-lg text-blosm-text-muted max-w-3xl mb-10 leading-relaxed">
            A growing staffing agency managing 400+ workers across multiple venues needed to replace
            their patchwork of spreadsheets, WhatsApp groups, and manual processes with something that
            actually worked.
          </p>

          {/* Key Stats */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="bg-blosm-card border border-blosm-border rounded-xl p-5 text-center">
              <p className="stat-value text-3xl mb-1">400+</p>
              <p className="text-blosm-text-muted text-sm">Workers managed</p>
            </div>
            <div className="bg-blosm-card border border-blosm-border rounded-xl p-5 text-center">
              <p className="stat-value text-3xl mb-1">3</p>
              <p className="text-blosm-text-muted text-sm">Venue locations</p>
            </div>
            <div className="bg-blosm-card border border-blosm-border rounded-xl p-5 text-center">
              <p className="stat-value text-3xl mb-1">0</p>
              <p className="text-blosm-text-muted text-sm">Spreadsheets needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Overview */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
                About the Client
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Chained Events
              </h2>
              <p className="text-lg text-blosm-text-muted mb-6 leading-relaxed">
                Chained Events is a fast-growing event staffing agency based in the UK. They provide
                skilled personnel for hospitality, security, and event operations across multiple
                high-profile venues.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-primary/10 flex items-center justify-center text-blosm-primary">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-blosm-text">400+ Active Workers</p>
                    <p className="text-blosm-text-muted text-sm">Bar staff, security, runners, technicians</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-primary/10 flex items-center justify-center text-blosm-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-blosm-text">3 Venue Locations</p>
                    <p className="text-blosm-text-muted text-sm">Each with unique staffing needs and operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-primary/10 flex items-center justify-center text-blosm-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-blosm-text">100+ Events Per Month</p>
                    <p className="text-blosm-text-muted text-sm">From corporate functions to music festivals</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden ">
                {/* Placeholder for client photo/video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blosm-primary/5 to-blosm-accent/5">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-blosm-card border border-blosm-border flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-gradient">CE</span>
                    </div>
                    <p className="text-blosm-text font-semibold">Chained Events</p>
                    <p className="text-blosm-text-muted text-sm">UK Event Staffing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="section bg-blosm-dark bg-grid">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              The Challenge
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Growth was breaking their systems
            </h2>
            <p className="text-xl text-blosm-text-muted">
              What worked for 50 workers couldn&apos;t handle 400. Every new hire made the chaos worse.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ChallengeCard
              title="Scheduling nightmare"
              description="Shift scheduling lived in Excel. Availability was tracked via text messages. Double-bookings happened weekly, and no-shows were only discovered when someone didn't turn up."
              cost="£200+ per no-show"
            />
            <ChallengeCard
              title="Communication black hole"
              description="Important updates got buried in WhatsApp groups. Workers would miss callsheet changes. Managers spent hours answering the same questions over and over."
              cost="10+ hours/week wasted"
            />
            <ChallengeCard
              title="Payroll chaos"
              description="Timesheet data was scattered across venues. Managers manually compiled hours at month end. Errors were common, and disputes took forever to resolve."
              cost="3 days to run payroll"
            />
            <ChallengeCard
              title="Stock shrinkage"
              description="Bar stock counts were done on paper and frequently lost. By the time discrepancies were found, it was too late to identify the cause. Thousands disappeared every month."
              cost="£1,500+/month lost"
            />
          </div>

          {/* Quote */}
          <div className="max-w-3xl mx-auto mt-16">
            <div className="bg-blosm-card border border-blosm-border rounded-2xl p-8 md:p-10 relative">
              <Quote className="w-10 h-10 text-blosm-primary/20 absolute top-6 left-6" />
              <blockquote className="text-xl md:text-2xl text-blosm-text leading-relaxed mb-6 pl-8">
                &quot;We were growing fast, but our tools weren&apos;t keeping up. Every new venue meant
                more spreadsheets, more group chats, more ways for things to fall through the cracks.
                Something had to change.&quot;
              </blockquote>
              <div className="flex items-center gap-4 pl-8">
                <div className="w-12 h-12 rounded-full bg-blosm-primary/10 flex items-center justify-center">
                  <span className="text-blosm-primary font-bold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-blosm-text">Operations Director</p>
                  <p className="text-blosm-text-muted text-sm">Chained Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              The Solution
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              A platform built for their reality
            </h2>
            <p className="text-xl text-blosm-text-muted">
              Not off-the-shelf software forced to fit. A system designed from day one for how event
              staffing actually works.
            </p>
          </div>

          <div className="space-y-8">
            <SolutionFeature
              icon={<Monitor className="w-8 h-8" />}
              title="Admin Portal"
              subtitle="One dashboard for everything"
              description="A central command center where managers can see all shifts, all workers, all venues at a glance. Create shifts, assign workers, handle swaps, and export payroll — without touching a spreadsheet."
              features={[
                'Multi-venue shift scheduling',
                'Real-time availability tracking',
                'Automated shift reminders',
                'One-click payroll exports',
                'Comprehensive reporting',
              ]}
              screenshotPlaceholder="Admin Dashboard Screenshot"
            />

            <SolutionFeature
              icon={<Smartphone className="w-8 h-8" />}
              title="Worker Mobile App"
              subtitle="Everything staff need in their pocket"
              description="Workers can view their shifts, update availability, receive notifications, and access callsheets — all from their phone. No more digging through group chats for basic information."
              features={[
                'Upcoming shift calendar',
                'Instant push notifications',
                'Digital callsheets',
                'Availability management',
                'Shift swap requests',
              ]}
              screenshotPlaceholder="Mobile App Screenshot"
              reversed
            />

            <SolutionFeature
              icon={<Package className="w-8 h-8" />}
              title="Stock & Bar Operations"
              subtitle="Counts that survive a busy Saturday"
              description="Digital stock counts that sync in real-time. Track what comes in, what goes out, and what's missing — before it becomes a problem."
              features={[
                'Real-time inventory tracking',
                'Multi-location stock views',
                'Automated discrepancy alerts',
                'Historical trend analysis',
                'Supplier integration ready',
              ]}
              screenshotPlaceholder="Stock Management Screenshot"
            />
          </div>
        </div>
      </section>

      {/* What We Built */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              Technical Delivery
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What we built
            </h2>
            <p className="text-lg text-blosm-text-muted">
              A complete digital transformation delivered in phases, with each release providing
              immediate value.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DeliverableCard
              title="Admin Web Portal"
              description="React-based dashboard with real-time data sync, role-based access, and comprehensive reporting."
            />
            <DeliverableCard
              title="iOS & Android App"
              description="Native-feel mobile app for workers with push notifications, offline support, and biometric login."
            />
            <DeliverableCard
              title="Stock Management System"
              description="Bar and equipment tracking with real-time counts, alerts, and historical analysis."
            />
            <DeliverableCard
              title="Marketing Website"
              description="Modern, conversion-focused website to attract new workers and showcase the brand."
            />
          </div>

          {/* Tech Stack */}
          <div className="mt-16 p-8 bg-blosm-card border border-blosm-border rounded-2xl">
            <h3 className="text-xl font-semibold text-center mb-6">Built with modern, scalable technology</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Next.js', 'React Native', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Vercel'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-blosm-darker border border-blosm-border rounded-lg text-blosm-text-muted text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Results */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              The Results
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Operational transformation
            </h2>
            <p className="text-xl text-blosm-text-muted">
              The numbers speak for themselves, but the real impact is in the hours saved and
              stress eliminated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <ResultCard
              metric="95%"
              label="App adoption rate"
              sublabel="Workers actively using the platform"
            />
            <ResultCard
              metric="80%"
              label="Less admin time"
              sublabel="On scheduling and comms"
            />
            <ResultCard
              metric="60%"
              label="Fewer no-shows"
              sublabel="With automated reminders"
            />
            <ResultCard
              metric="1 day"
              label="Payroll processing"
              sublabel="Down from 3 days"
            />
          </div>

          {/* Final Quote */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blosm-primary/10 to-blosm-accent/10 border border-blosm-primary/20 rounded-2xl p-8 md:p-10 relative">
              <Quote className="w-10 h-10 text-blosm-primary/30 absolute top-6 left-6" />
              <blockquote className="text-xl md:text-2xl text-blosm-text leading-relaxed mb-6 pl-8">
                &quot;Blosm didn&apos;t just build us software — they understood our problems because
                they&apos;ve lived them. The platform works the way we work. Our staff actually use it,
                which is the ultimate test.&quot;
              </blockquote>
              <div className="flex items-center gap-4 pl-8">
                <div className="w-12 h-12 rounded-full bg-blosm-primary/20 flex items-center justify-center">
                  <span className="text-blosm-primary font-bold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-blosm-text">Operations Director</p>
                  <p className="text-blosm-text-muted text-sm">Chained Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to transform <span className="text-gradient">your operations</span>?
            </h2>
            <p className="text-xl text-blosm-text-muted mb-10">
              Whether you&apos;re managing 50 workers or 500, we can build something that actually fits
              how you work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary text-lg">
                Book a call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solutions/staffing" className="btn-secondary text-lg">
                Explore solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

/* Challenge Card Component */
function ChallengeCard({
  title,
  description,
  cost,
}: {
  title: string
  description: string
  cost: string
}) {
  return (
    <div className="p-8 bg-blosm-card border border-blosm-border rounded-2xl card-hover">
      <h3 className="text-xl font-bold text-blosm-text mb-4">{title}</h3>
      <p className="text-blosm-text-muted mb-6 leading-relaxed">{description}</p>
      <div className="flex items-center gap-2">
        <span className="text-blosm-accent font-bold">{cost}</span>
      </div>
    </div>
  )
}

/* Solution Feature Component */
function SolutionFeature({
  icon,
  title,
  subtitle,
  description,
  features,
  screenshotPlaceholder,
  reversed = false,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  features: string[]
  screenshotPlaceholder: string
  reversed?: boolean
}) {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
      <div className={reversed ? 'lg:order-2' : ''}>
        <div className="icon-box mb-4">
          {icon}
        </div>
        <p className="text-blosm-accent font-medium text-sm mb-2">{subtitle}</p>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="text-lg text-blosm-text-muted mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-blosm-text-muted">
              <CheckCircle className="w-5 h-5 text-blosm-accent flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reversed ? 'lg:order-1' : ''}>
        <div className="aspect-[4/3] bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden ">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <Monitor className="w-16 h-16 text-blosm-primary mx-auto mb-4" />
              <p className="text-blosm-text-muted">{screenshotPlaceholder}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Deliverable Card Component */
function DeliverableCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl card-hover">
      <Zap className="w-6 h-6 text-blosm-accent mb-4" />
      <h3 className="text-lg font-bold text-blosm-text mb-2">{title}</h3>
      <p className="text-blosm-text-muted text-sm leading-relaxed">{description}</p>
    </div>
  )
}

/* Result Card Component */
function ResultCard({
  metric,
  label,
  sublabel,
}: {
  metric: string
  label: string
  sublabel: string
}) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl text-center">
      <TrendingUp className="w-6 h-6 text-blosm-accent mx-auto mb-3" />
      <p className="stat-value text-3xl md:text-4xl mb-2">{metric}</p>
      <p className="text-blosm-text font-semibold">{label}</p>
      <p className="text-blosm-text-muted text-sm">{sublabel}</p>
    </div>
  )
}
