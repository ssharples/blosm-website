import { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '../../components/Navigation'
import { Footer } from '../../components/Footer'
import {
  ArrowRight,
  CheckCircle,
  Users,
  Calendar,
  Clock,
  Smartphone,
  Monitor,
  Upload,
  Zap,
  TrendingUp,
  Database,
} from '../../components/Icons'

export const metadata: Metadata = {
  title: 'Staffing Suite | Blosm',
  description: 'Complete staffing management for events. Shift scheduling, worker app, availability tracking, and payroll exports in one platform.',
}

export default function StaffingSolutionPage() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 bg-glow-top relative">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blosm-card border border-blosm-border rounded-full mb-6">
              <Users className="w-4 h-4 text-blosm-primary" />
              <span className="text-xs text-blosm-text-muted">Staffing Solution</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight">
              Staffing that scales{' '}
              <span className="text-gradient">without the chaos</span>
            </h1>
            <p className="text-lg text-blosm-text-muted mb-10 leading-relaxed">
              Your 400 workers get one app. You get one dashboard. No more spreadsheets, no more
              WhatsApp chaos, no more 2am panic about who&apos;s showing up.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary">
                Book a demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/case-study/chained-events" className="btn-secondary">
                See it in action
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sound familiar?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              problem="Excel for scheduling"
              pain="Constantly out of date, can't sync, no one trusts it"
            />
            <ProblemCard
              problem="WhatsApp for comms"
              pain="Important messages buried, workers miss updates"
            />
            <ProblemCard
              problem="Paper timesheets"
              pain="3 days to process payroll, constant disputes"
            />
          </div>

          <p className="text-xl text-blosm-text-muted text-center max-w-3xl mx-auto mt-12">
            Generic HR software doesn&apos;t understand event staffing. You need something built for
            shifts, availability windows, and last-minute changes.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-blosm-dark bg-grid">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Everything you need,{' '}
              <span className="text-gradient">nothing you don&apos;t</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Shift Scheduling"
              description="Create, copy, and manage shifts across venues. Drag-and-drop interface that anyone can use."
              features={['Multi-venue support', 'Template shifts', 'Bulk operations', 'Conflict detection']}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Availability Tracking"
              description="Workers set their availability in the app. You see who's free at a glance. No more texting around."
              features={['Weekly patterns', 'One-off blocks', 'Instant updates', 'Calendar sync']}
            />
            <FeatureCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Worker Mobile App"
              description="Everything staff need in their pocket. Shifts, callsheets, notifications, and more."
              features={['Push notifications', 'Digital callsheets', 'Shift acceptance', 'Swap requests']}
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Time & Attendance"
              description="Digital clock-in with location verification. Know who's on site, who's late, who's a no-show."
              features={['GPS check-in', 'Photo verification', 'Break tracking', 'Overtime alerts']}
            />
            <FeatureCard
              icon={<Database className="w-6 h-6" />}
              title="Payroll Export"
              description="One-click export to your payroll system. Hours, rates, deductions — all calculated automatically."
              features={['Custom rates', 'Auto calculations', 'Multiple formats', 'Audit trail']}
            />
            <FeatureCard
              icon={<Monitor className="w-6 h-6" />}
              title="Admin Dashboard"
              description="See everything at a glance. Upcoming shifts, staff counts, alerts, and reports in one place."
              features={['Real-time updates', 'Custom reports', 'Role-based access', 'Mobile responsive']}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              From chaos to clarity
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <StepCard
                number="01"
                title="Import your workers"
                description="Upload your existing staff list (CSV, Excel, or manual entry). We'll get everyone into the system with their roles, rates, and contact details."
              />
              <StepCard
                number="02"
                title="Create your shifts"
                description="Build out your event schedule. Set locations, times, required roles, and worker counts. Use templates for recurring events."
              />
              <StepCard
                number="03"
                title="Workers set availability"
                description="Staff download the app and mark when they're free to work. You see real-time availability when assigning shifts."
              />
              <StepCard
                number="04"
                title="Assign and notify"
                description="Fill shifts with available workers. They get instant notifications and can accept or request swaps right in the app."
              />
              <StepCard
                number="05"
                title="Track and pay"
                description="Clock-ins are recorded automatically. At the end of the pay period, export clean data to your payroll system."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Real results for real operations
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <ResultCard metric="80%" label="Less admin time on scheduling" />
            <ResultCard metric="60%" label="Fewer no-shows" />
            <ResultCard metric="1 day" label="Payroll processing (was 3)" />
            <ResultCard metric="95%" label="Worker app adoption" />
          </div>
        </div>
      </section>

      {/* Migration */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Switching doesn&apos;t have to be painful
              </h2>
              <p className="text-lg text-blosm-text-muted mb-8 leading-relaxed">
                We know the thought of moving off spreadsheets feels risky. That&apos;s why we handle
                the heavy lifting. Your data migrates clean, your team gets trained, and you have
                support every step of the way.
              </p>

              <div className="space-y-4">
                <MigrationStep icon={<Upload className="w-5 h-5" />} text="We import your existing data — workers, rates, venues" />
                <MigrationStep icon={<Users className="w-5 h-5" />} text="We train your admin team before go-live" />
                <MigrationStep icon={<Smartphone className="w-5 h-5" />} text="We help onboard your workers to the app" />
                <MigrationStep icon={<Zap className="w-5 h-5" />} text="We stick around until everything's running smooth" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-blosm-accent/10 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-blosm-accent" />
                  </div>
                  <p className="text-2xl font-bold text-blosm-text mb-2">Zero downtime</p>
                  <p className="text-blosm-text-muted">Run in parallel until you&apos;re confident</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
              Ready to ditch the spreadsheets?
            </h2>
            <p className="text-lg text-blosm-text-muted mb-8">
              Let&apos;s talk about what you need. No pitch deck, no pressure — just a conversation
              about how we can help.
            </p>
            <Link href="/contact" className="btn-primary inline-flex">
              Book a call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProblemCard({ problem, pain }: { problem: string; pain: string }) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl">
      <p className="text-blosm-accent font-bold mb-2">{problem}</p>
      <p className="text-blosm-text-muted">{pain}</p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="p-8 bg-blosm-card border border-blosm-border rounded-2xl card-hover">
      <div className="icon-box mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-blosm-text-muted mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-blosm-text-muted">
            <CheckCircle className="w-4 h-4 text-blosm-accent flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blosm-primary/10 border border-blosm-primary/20 flex items-center justify-center">
        <span className="text-blosm-primary font-bold">{number}</span>
      </div>
      <div className="flex-1 pb-8 border-b border-blosm-border last:border-0 last:pb-0">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-blosm-text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function ResultCard({ metric, label }: { metric: string; label: string }) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl text-center">
      <p className="stat-value text-3xl md:text-4xl mb-2">{metric}</p>
      <p className="text-blosm-text-muted text-sm">{label}</p>
    </div>
  )
}

function MigrationStep({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-accent/10 flex items-center justify-center text-blosm-accent">
        {icon}
      </div>
      <p className="text-blosm-text">{text}</p>
    </div>
  )
}
