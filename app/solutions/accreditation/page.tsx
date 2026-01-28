import { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '../../components/Navigation'
import { Footer } from '../../components/Footer'
import {
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  QrCode,
  Printer,
  Shield,
  Users,
  MapPin,
  Zap,
  Monitor,
  Database,
} from '../../components/Icons'

export const metadata: Metadata = {
  title: 'Accreditation System | Blosm',
  description: 'Event accreditation and access control. Credentials, passes, zone management. Print, scan, done. From festivals to corporate events.',
}

export default function AccreditationSolutionPage() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 bg-glow-top relative">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blosm-card border border-blosm-border rounded-full mb-6">
              <BadgeCheck className="w-4 h-4 text-blosm-primary" />
              <span className="text-xs text-blosm-text-muted">Accreditation Solution</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight">
              Credentials that{' '}
              <span className="text-gradient">just work</span>
            </h1>
            <p className="text-lg text-blosm-text-muted mb-10 leading-relaxed">
              Print, scan, done. From 200-person conferences to 50,000-person festivals, our
              accreditation system handles the complexity so you don&apos;t have to.
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

      {/* Use Cases */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for every type of event
            </h2>
            <p className="text-lg text-blosm-text-muted">
              Whether you&apos;re credentialing 200 attendees or managing access for 50,000, the
              fundamentals are the same — but the details matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <UseCaseCard
              title="Festivals & Concerts"
              description="Multi-day events with complex zone access. Artist, crew, media, VIP — each with different permissions across different areas."
              features={['Multi-zone access', 'Day-by-day validity', 'Quick print stations']}
            />
            <UseCaseCard
              title="Corporate Events"
              description="Professional conferences and company events where first impressions matter. Clean badges, fast check-in, no queues."
              features={['On-site printing', 'Pre-registration', 'Session tracking']}
            />
            <UseCaseCard
              title="Venues & Hospitality"
              description="Ongoing accreditation for regular staff and contractors. Know who has access to what, and when their credentials expire."
              features={['Role-based access', 'Expiry management', 'Audit trails']}
            />
          </div>
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
              From registration to{' '}
              <span className="text-gradient">access control</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Registration Portal"
              description="Self-service registration for attendees, or bulk import for your team. Collect the data you need, skip what you don't."
              features={['Custom forms', 'Bulk import', 'Photo upload', 'Approval workflows']}
            />
            <FeatureCard
              icon={<BadgeCheck className="w-6 h-6" />}
              title="Credential Design"
              description="Design passes that match your brand. Different styles for different credential types, automatic color coding by access level."
              features={['Template library', 'Custom branding', 'Auto photo resize', 'QR/barcode']}
            />
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Zone Management"
              description="Define your zones — backstage, VIP, media pit, catering. Assign access by credential type and track who goes where."
              features={['Unlimited zones', 'Time-based access', 'Zone grouping', 'Visual maps']}
            />
            <FeatureCard
              icon={<Printer className="w-6 h-6" />}
              title="Print Stations"
              description="Set up print stations anywhere. Queue management, batch printing, and instant reprints when someone loses their pass."
              features={['Multi-printer support', 'Queue management', 'Batch printing', 'Reprint tracking']}
            />
            <FeatureCard
              icon={<QrCode className="w-6 h-6" />}
              title="Scan & Verify"
              description="Any smartphone becomes a scanner. Instant visual feedback — green for access, red for denied. Works offline too."
              features={['iOS & Android', 'Offline capable', 'Scan history', 'Manual override']}
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Security Features"
              description="Revoke credentials instantly, block duplicates, flag suspicious activity. Real-time alerts when something's off."
              features={['Instant revocation', 'Duplicate detection', 'Activity alerts', 'Audit log']}
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
              Simple for you, seamless for attendees
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <StepItem
                number="01"
                title="Set up your event"
                description="Define credential types, access zones, and validity periods. Use templates for recurring events."
              />
              <StepItem
                number="02"
                title="Collect registrations"
                description="Share registration links or import your guest list. Approve submissions and assign credential types."
              />
              <StepItem
                number="03"
                title="Print on demand"
                description="Set up print stations at entry points. Credentials print in seconds with all the right access encoded."
              />
              <StepItem
                number="04"
                title="Scan at access points"
                description="Staff use their phones to scan passes. Instant verification with clear visual feedback."
              />
            </div>
            <div className="relative">
              <div className="aspect-square bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-40 bg-gradient-to-br from-blosm-primary/20 to-blosm-accent/20 rounded-lg border border-blosm-border mx-auto mb-4 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-blosm-card rounded border border-blosm-border mb-2"></div>
                    <div className="w-20 h-2 bg-blosm-border rounded mb-1"></div>
                    <div className="w-16 h-2 bg-blosm-border rounded"></div>
                  </div>
                  <p className="text-blosm-text-muted text-sm">Credential Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Trusted at scale
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StatCard metric="50K+" label="Credentials processed" />
            <StatCard metric="<3s" label="Average print time" />
            <StatCard metric="99.9%" label="Scan accuracy" />
            <StatCard metric="0" label="Excel files needed" />
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Works with what you have
              </h2>
              <p className="text-lg text-blosm-text-muted mb-8 leading-relaxed">
                Already using ticketing software? Registration systems? We integrate with your
                existing tools so you don&apos;t have to change everything.
              </p>

              <div className="space-y-4">
                <IntegrationItem icon={<Database className="w-5 h-5" />} text="Import from any ticketing system via CSV or API" />
                <IntegrationItem icon={<Printer className="w-5 h-5" />} text="Works with standard badge printers (Zebra, Dymo, etc.)" />
                <IntegrationItem icon={<Monitor className="w-5 h-5" />} text="API access for custom integrations" />
                <IntegrationItem icon={<Zap className="w-5 h-5" />} text="Webhook support for real-time data sync" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden flex items-center justify-center p-8">
                <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                  {['Eventbrite', 'Ticketmaster', 'Custom API', 'CSV Import', 'Zebra', 'Dymo'].map((integration) => (
                    <div
                      key={integration}
                      className="aspect-square bg-blosm-darker border border-blosm-border rounded-lg flex items-center justify-center p-2"
                    >
                      <span className="text-blosm-text-muted text-xs text-center">{integration}</span>
                    </div>
                  ))}
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
              Ready to streamline your credentials?
            </h2>
            <p className="text-lg text-blosm-text-muted mb-8">
              Tell us about your next event. We&apos;ll show you how the system works for your
              specific needs.
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

function UseCaseCard({
  title,
  description,
  features,
}: {
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="p-8 bg-blosm-card border border-blosm-border rounded-2xl card-hover">
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

function StepItem({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blosm-accent/10 border border-blosm-accent/20 flex items-center justify-center">
        <span className="text-blosm-accent font-bold text-sm">{number}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-blosm-text-muted">{description}</p>
      </div>
    </div>
  )
}

function StatCard({ metric, label }: { metric: string; label: string }) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl text-center">
      <p className="stat-value text-3xl md:text-4xl mb-2">{metric}</p>
      <p className="text-blosm-text-muted text-sm">{label}</p>
    </div>
  )
}

function IntegrationItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-primary/10 flex items-center justify-center text-blosm-primary">
        {icon}
      </div>
      <p className="text-blosm-text">{text}</p>
    </div>
  )
}
