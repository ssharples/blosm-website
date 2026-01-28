import Link from 'next/link'
import { Navigation } from './components/Navigation'
import { Footer } from './components/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="section pt-32 md:pt-40 bg-glow-top relative">
        <div className="container-custom text-center relative z-10">
          <p className="text-blosm-primary font-medium mb-6 tracking-wide uppercase text-xs">
            Trusted by Chained Events & leading UK staffing agencies
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight max-w-4xl mx-auto">
            <span className="text-blosm-text">400+ workers. 3 venues.</span>
            <br />
            <span className="text-gradient">Zero spreadsheets.</span>
          </h1>
          <p className="text-lg md:text-xl text-blosm-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            We build operational software for companies that run events — staffing, accreditation,
            stock management. Built by people who&apos;ve been in the production office at 2am.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/case-study/chained-events" className="btn-primary">
              See how we built it
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#solutions" className="btn-secondary">
              View solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-14 tracking-tight">
            The cost of <span className="text-blosm-accent">&quot;good enough&quot;</span> tools
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            <PainPointCard
              icon={<XCircle className="w-5 h-5" />}
              cost="£200 wasted"
              description="A no-show you didn't catch until doors opened"
            />
            <PainPointCard
              icon={<XCircle className="w-5 h-5" />}
              cost="£1,500 in shrinkage"
              description="Stock count done on paper, lost by Saturday night"
            />
            <PainPointCard
              icon={<XCircle className="w-5 h-5" />}
              cost="Your sanity"
              description="Staff texting you for the callsheet because the group chat buried it"
            />
          </div>

          <p className="text-lg text-blosm-text-muted text-center max-w-2xl mx-auto">
            Generic software doesn&apos;t understand events. So you patch it with spreadsheets,
            WhatsApp, and hope.
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="section bg-blosm-dark">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-3 tracking-tight">
            One partner. <span className="text-gradient">All your event tech.</span>
          </h2>
          <p className="text-blosm-text-muted text-center mb-14 text-lg">
            Purpose-built solutions that speak the language of events
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            <SolutionCard
              icon={<Users className="w-6 h-6" />}
              title="Staffing Suite"
              description="Shift scheduling, availability, worker app, payroll exports. Your 400 staff get one app. You get one dashboard."
              features={["Shift scheduling", "Worker mobile app", "Availability tracking", "Payroll exports"]}
              href="/solutions/staffing"
            />
            <SolutionCard
              icon={<BadgeCheck className="w-6 h-6" />}
              title="Accreditation"
              description="Credentials, passes, access zones. Print, scan, done. From festivals to corporate."
              features={["Credential management", "Access zone control", "Print & scan", "Multi-event support"]}
              href="/solutions/accreditation"
              highlighted
            />
            <SolutionCard
              icon={<Package className="w-6 h-6" />}
              title="Stock Management"
              description="Bar stock, equipment, merch. Counts that survive a busy Saturday."
              features={["Inventory tracking", "Bar stock management", "Equipment logs", "Real-time counts"]}
              href="/solutions/stock-management"
            />
          </div>

          <p className="text-center text-blosm-text-muted mt-10 text-sm">
            <span className="text-blosm-primary font-medium">+ Event websites that actually convert</span> — ask us about marketing sites
          </p>
        </div>
      </section>

      {/* Trust/Stats Section */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-14 tracking-tight">
            Built for <span className="text-gradient">real event operations</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mb-14">
            <StatCard value="400+" label="Workers managed through one platform" />
            <StatCard value="3" label="Venue locations, one dashboard" />
            <StatCard value="£0" label="Spent on third-party SaaS subscriptions" />
          </div>

          <div className="text-center">
            <p className="text-blosm-text-dim text-sm mb-5">Trusted by</p>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <div className="px-6 py-3 border border-blosm-border rounded-lg bg-blosm-card">
                <span className="text-lg font-semibold text-blosm-text">Chained Events</span>
              </div>
              <div className="px-6 py-3 border border-blosm-border/40 border-dashed rounded-lg">
                <span className="text-blosm-text-dim text-sm">Your logo here</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section id="case-study" className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blosm-primary font-medium mb-3 uppercase tracking-wide text-xs">Case Study</p>
              <h2 className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
                Chained Events
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blosm-text mb-2">The challenge</h3>
                <p className="text-blosm-text-muted leading-relaxed">
                  A growing staffing agency juggling shifts, stock, and staff comms across
                  multiple venues — all on spreadsheets and group chats.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blosm-text mb-3">What we built</h3>
                <ul className="space-y-2">
                  <FeatureListItem>Admin portal for shift management</FeatureListItem>
                  <FeatureListItem>Mobile app for 400+ workers</FeatureListItem>
                  <FeatureListItem>Stock/bar operations tracking</FeatureListItem>
                  <FeatureListItem>Full marketing website</FeatureListItem>
                </ul>
              </div>

              <div className="p-5 bg-blosm-card rounded-xl border border-blosm-border mb-6">
                <h3 className="text-lg font-semibold text-blosm-text mb-2">The result</h3>
                <p className="text-xl font-semibold text-gradient">
                  One platform. No spreadsheets. Staff actually use it.
                </p>
              </div>

              <Link href="/case-study/chained-events" className="btn-primary">
                Read the full case study
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blosm-primary/5 to-transparent">
                  <div className="text-center p-8">
                    <Monitor className="w-14 h-14 text-blosm-primary/60 mx-auto mb-4" />
                    <p className="text-blosm-text-muted text-sm">App screenshot coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objection Handling Section */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-10 tracking-tight">
              But switching sounds <span className="text-blosm-accent">painful...</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <ObjectionCard
                icon={<Upload className="w-5 h-5" />}
                text="Import your existing staff list in one click"
              />
              <ObjectionCard
                icon={<Database className="w-5 h-5" />}
                text="We migrate your data — you don't touch a spreadsheet"
              />
              <ObjectionCard
                icon={<GraduationCap className="w-5 h-5" />}
                text="Your team gets trained before go-live"
              />
              <ObjectionCard
                icon={<HeartHandshake className="w-5 h-5" />}
                text="We stick around after launch (no ghost agencies here)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
              Why <span className="text-gradient">Blosm</span>?
            </h2>
            <p className="text-lg md:text-xl text-blosm-text-muted leading-relaxed">
              We&apos;ve built tech for real event operations — not as consultants, but as
              people who&apos;ve run the ops ourselves. We know what breaks on show day.
              We build software that doesn&apos;t.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
              Ready to build something that <span className="text-gradient">actually works</span>?
            </h2>
            <p className="text-lg text-blosm-text-muted mb-8">
              No pitch deck. No 6-month scoping. Just a conversation about what you need.
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

/* Icon Components */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}

function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

function Monitor({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  )
}

function Database({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  )
}

function GraduationCap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  )
}

function HeartHandshake({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

/* Component Cards */
function PainPointCard({ icon, cost, description }: { icon: React.ReactNode; cost: string; description: string }) {
  return (
    <div className="p-5 bg-blosm-card rounded-xl border border-blosm-border">
      <div className="text-blosm-accent mb-3">{icon}</div>
      <p className="text-blosm-text-muted text-sm mb-2">{description}</p>
      <p className="text-xl font-semibold text-blosm-accent">{cost}</p>
    </div>
  )
}

function SolutionCard({
  icon,
  title,
  description,
  features,
  href,
  highlighted = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  highlighted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl border card-hover ${
        highlighted
          ? 'bg-gradient-to-b from-blosm-primary/5 to-blosm-card border-blosm-primary/20'
          : 'bg-blosm-card border-blosm-border'
      }`}
    >
      <div className={`icon-box mb-5 ${highlighted ? 'bg-blosm-primary/15 border-blosm-primary/20' : ''}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-blosm-text-muted text-sm mb-5 leading-relaxed">{description}</p>
      <ul className="space-y-1.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-blosm-text-muted">
            <CheckCircle className="w-3.5 h-3.5 text-blosm-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </Link>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 bg-blosm-card rounded-xl border border-blosm-border">
      <p className="stat-value mb-2">{value}</p>
      <p className="text-blosm-text-muted text-sm">{label}</p>
    </div>
  )
}

function ObjectionCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-blosm-card rounded-xl border border-blosm-border">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blosm-primary/10 flex items-center justify-center text-blosm-primary">
        {icon}
      </div>
      <p className="text-blosm-text text-sm pt-2">{text}</p>
    </div>
  )
}

function FeatureListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-blosm-text-muted text-sm">
      <CheckCircle className="w-4 h-4 text-blosm-primary flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
}
