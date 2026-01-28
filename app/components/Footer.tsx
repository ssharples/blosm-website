import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-blosm-darker border-t border-blosm-border">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-gradient inline-block mb-4">
              Blosm
            </Link>
            <p className="text-blosm-text-muted max-w-md">
              Software for the event industry. Built by people who&apos;ve been in the production office at 2am.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold text-blosm-text mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions/staffing" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Staffing Suite
                </Link>
              </li>
              <li>
                <Link href="/solutions/accreditation" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Accreditation
                </Link>
              </li>
              <li>
                <Link href="/solutions/stock-management" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Stock Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-blosm-text mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/case-study/chained-events" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Case Study
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blosm-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blosm-text-muted text-sm">
            © {new Date().getFullYear()} Blosm. Software for the event industry.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="text-blosm-text-muted hover:text-blosm-text transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
