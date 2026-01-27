import { Hero } from '../components/sections/hero'
import { ServicesGrid } from '../components/sections/services-grid'
import { StatsBar } from '../components/sections/stats-bar'
import { CaseStudies } from '../components/sections/case-studies'
import { Testimonials } from '../components/sections/testimonials'
import { CTASection } from '../components/sections/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="services">
        <ServicesGrid />
      </section>
      <StatsBar />
      <section id="work">
        <CaseStudies />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="contact">
        <CTASection />
      </section>
    </>
  )
}
