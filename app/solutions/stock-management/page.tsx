import { Metadata } from 'next'
import Link from 'next/link'
import { Navigation } from '../../components/Navigation'
import { Footer } from '../../components/Footer'
import {
  ArrowRight,
  CheckCircle,
  Package,
  BarChart,
  Clipboard,
  RefreshCw,
  Smartphone,
  Monitor,
  Zap,
  TrendingUp,
  Clock,
} from '../../components/Icons'

export const metadata: Metadata = {
  title: 'Stock Management | Blosm',
  description: 'Inventory tracking for events. Bar stock, equipment, merch. Real-time counts that survive a busy Saturday night.',
}

export default function StockManagementPage() {
  return (
    <main className="min-h-screen bg-blosm-dark">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 bg-glow-top relative">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blosm-card border border-blosm-border rounded-full mb-6">
              <Package className="w-4 h-4 text-blosm-primary" />
              <span className="text-xs text-blosm-text-muted">Stock Management</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-tight">
              Counts that survive{' '}
              <span className="text-gradient">a busy Saturday</span>
            </h1>
            <p className="text-lg text-blosm-text-muted mb-10 leading-relaxed">
              Bar stock, equipment, merch — tracked in real-time. Know what you have, where it is,
              and what&apos;s going missing before it becomes a problem.
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
              The reality of event stock
            </h2>
            <p className="text-lg text-blosm-text-muted">
              Paper counts get lost. Spreadsheets are out of date by the time they&apos;re shared.
              By the time you find a discrepancy, it&apos;s too late to do anything about it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              title="Paper counts"
              problem="Lost, illegible, or forgotten by Sunday morning"
              cost="Unknown shrinkage"
            />
            <ProblemCard
              title="Spreadsheet chaos"
              problem="Multiple versions, no one knows which is current"
              cost="Hours reconciling"
            />
            <ProblemCard
              title="After-the-fact discovery"
              problem="Find out what's missing when it's too late to act"
              cost="£1,500+/month"
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
              Real-time visibility,{' '}
              <span className="text-gradient">zero paper</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clipboard className="w-6 h-6" />}
              title="Digital Stock Counts"
              description="Count on your phone or tablet. Data syncs instantly. No more clipboards and paper that gets lost."
              features={['Barcode scanning', 'Photo evidence', 'Offline capable', 'Location tagging']}
            />
            <FeatureCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Real-Time Sync"
              description="Every count, every adjustment, every transfer — visible instantly across all locations and devices."
              features={['Live updates', 'Multi-location', 'Conflict resolution', 'Sync status']}
            />
            <FeatureCard
              icon={<BarChart className="w-6 h-6" />}
              title="Analytics & Trends"
              description="See what's actually happening with your stock. Identify patterns, catch anomalies, make better decisions."
              features={['Shrinkage reports', 'Usage patterns', 'Forecasting', 'Custom reports']}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Alerts"
              description="Get notified when stock drops below threshold, when counts don't match, or when something looks off."
              features={['Low stock alerts', 'Discrepancy flags', 'Custom triggers', 'Push & email']}
            />
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title="Multi-Category Support"
              description="Bar stock, equipment, merch, consumables — different categories, same system, complete visibility."
              features={['Custom categories', 'Unit conversions', 'Par levels', 'Supplier links']}
            />
            <FeatureCard
              icon={<Monitor className="w-6 h-6" />}
              title="Admin Dashboard"
              description="One view of everything. Current levels, pending counts, alerts, and reports — all in one place."
              features={['Real-time overview', 'Multi-venue view', 'Export tools', 'User management']}
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              Use Cases
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for how events actually work
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="Bar Stock"
              description="Track every bottle, keg, and mixer across multiple bars. Real-time visibility into what's being used and what's going missing."
              features={[
                'Opening and closing counts',
                'Live pour tracking',
                'Wastage logging',
                'Shrinkage analysis',
                'Supplier order integration',
              ]}
            />
            <UseCaseCard
              title="Event Equipment"
              description="Know where your gear is and when it needs maintenance. From PA systems to tables and chairs."
              features={[
                'Asset tracking',
                'Check-in/check-out',
                'Maintenance schedules',
                'Condition reports',
                'Location history',
              ]}
            />
            <UseCaseCard
              title="Merchandise"
              description="Track what's selling, what's sitting, and what's walking out the door. Real-time sales data integration."
              features={[
                'SKU management',
                'Sales integration',
                'Reorder alerts',
                'Loss prevention',
                'Performance reports',
              ]}
            />
            <UseCaseCard
              title="Catering & Consumables"
              description="Food, supplies, disposables — track consumption and minimize waste across events and venues."
              features={[
                'Batch tracking',
                'Expiry management',
                'Prep sheets',
                'Waste logging',
                'Cost tracking',
              ]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-blosm-accent font-medium mb-4 uppercase tracking-wide text-sm">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Simple enough for busy bar staff
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <ProcessCard
              step="1"
              title="Set up your inventory"
              description="Import your products and set up locations. Define par levels and alert thresholds."
            />
            <ProcessCard
              step="2"
              title="Count on any device"
              description="Staff open the app, select their location, and count. Scan barcodes or tap to adjust quantities."
            />
            <ProcessCard
              step="3"
              title="See results instantly"
              description="Data syncs in real-time. Discrepancies are flagged. Reports are generated automatically."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The numbers don&apos;t lie
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              metric="40%"
              label="Reduction in shrinkage"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              metric="75%"
              label="Faster stock counts"
            />
            <StatCard
              icon={<BarChart className="w-6 h-6" />}
              metric="100%"
              label="Visibility across locations"
            />
            <StatCard
              icon={<Package className="w-6 h-6" />}
              metric="0"
              label="Paper clipboards needed"
            />
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className="section bg-blosm-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Fits into your workflow
              </h2>
              <p className="text-lg text-blosm-text-muted mb-8 leading-relaxed">
                Not another standalone system. Our stock management integrates with your existing
                POS, accounting, and supplier systems to give you one source of truth.
              </p>

              <div className="space-y-4">
                <IntegrationItem text="POS integration for automatic sales deduction" />
                <IntegrationItem text="Accounting export for cost tracking" />
                <IntegrationItem text="Supplier integration for reorder automation" />
                <IntegrationItem text="API access for custom integrations" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-blosm-card rounded-2xl border border-blosm-border overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <Smartphone className="w-16 h-16 text-blosm-primary mx-auto mb-4" />
                  <p className="text-blosm-text font-semibold mb-2">Mobile-First Counting</p>
                  <p className="text-blosm-text-muted text-sm">Works on any phone or tablet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-blosm-darker">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight">
              Stop losing stock to chaos
            </h2>
            <p className="text-lg text-blosm-text-muted mb-8">
              Let&apos;s talk about what you&apos;re tracking and where the gaps are. We&apos;ll show
              you how to get real visibility without adding complexity.
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

function ProblemCard({
  title,
  problem,
  cost,
}: {
  title: string
  problem: string
  cost: string
}) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl">
      <p className="text-blosm-accent font-bold mb-2">{title}</p>
      <p className="text-blosm-text-muted mb-4">{problem}</p>
      <p className="text-sm text-blosm-text-dim">{cost}</p>
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
    <div className="p-8 bg-blosm-card border border-blosm-border rounded-2xl">
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-blosm-text-muted mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-blosm-text-muted">
            <CheckCircle className="w-4 h-4 text-blosm-accent flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProcessCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-blosm-primary/10 border border-blosm-primary/20 flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl font-bold text-blosm-primary">{step}</span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-blosm-text-muted">{description}</p>
    </div>
  )
}

function StatCard({
  icon,
  metric,
  label,
}: {
  icon: React.ReactNode
  metric: string
  label: string
}) {
  return (
    <div className="p-6 bg-blosm-card border border-blosm-border rounded-xl text-center">
      <div className="w-12 h-12 rounded-full bg-blosm-accent/10 flex items-center justify-center mx-auto mb-4 text-blosm-accent">
        {icon}
      </div>
      <p className="stat-value text-3xl md:text-4xl mb-2">{metric}</p>
      <p className="text-blosm-text-muted text-sm">{label}</p>
    </div>
  )
}

function IntegrationItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-blosm-accent flex-shrink-0" />
      <p className="text-blosm-text">{text}</p>
    </div>
  )
}
