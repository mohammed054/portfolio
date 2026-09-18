import AboutHero from '../components/about/AboutHero.jsx'
import ServicesStrip from '../components/about/ServicesStrip.jsx'
import PlatformsAndTestimonials from '../components/about/PlatformsAndTestimonials.jsx'
import TeamSection from '../components/about/TeamSection.jsx'
import CTACountdown from '../components/about/CTACountdown.jsx'

export default function About() {
  return (
    <>
      <AboutHero />
      <ServicesStrip />
      <PlatformsAndTestimonials />
      <TeamSection />
      <CTACountdown />
    </>
  )
}
