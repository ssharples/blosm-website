import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-blosm-darker border-t border-blosm-border-subtle">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Image
                src="/images/blosm-logo-2.svg"
                alt="Blosm"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="text-lg font-semibold text-blosm-text tracking-tight">
                Blosm
              </span>
            </Link>
            <p className="text-blosm-text-muted text-sm leading-relaxed max-w-sm">
              Software for the event industry. Built by people who&apos;ve been in the production office at 2am.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-blosm-text mb-4 tracking-tight">Solutions</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/solutions/staffing" className="text-sm text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Staffing Suite
                </Link>
              </li>
              <li>
                <Link href="/solutions/accreditation" className="text-sm text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Accreditation
                </Link>
              </li>
              <li>
                <Link href="/solutions/stock-management" className="text-sm text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Stock Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-blosm-text mb-4 tracking-tight">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-blosm-text-muted hover:text-blosm-text transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/case-study/chained-events" className="text-sm text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Case Study
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blosm-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blosm-text-dim text-xs">
            &copy; {new Date().getFullYear()} Blosm. Software for the event industry.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy-policy" className="text-blosm-text-dim hover:text-blosm-text-muted transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="text-blosm-text-dim hover:text-blosm-text-muted transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
