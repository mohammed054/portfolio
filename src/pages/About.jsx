import AboutHero from '../components/about/AboutHero.jsx'
import ServicesStrip from '../components/about/ServicesStrip.jsx'
import PlatformsAndTestimonials from '../components/about/PlatformsAndTestimonials.jsx'
import TeamSection from '../components/about/TeamSection.jsx'
import CTACountdown from '../components/about/CTACountdown.jsx'
import Reveal from '../components/shared/Reveal.jsx'

export default function About() {
  return (
    <>
      <Reveal><AboutHero /></Reveal>
      <Reveal><ServicesStrip /></Reveal>
      <Reveal><PlatformsAndTestimonials /></Reveal>
      <Reveal><TeamSection /></Reveal>
      <Reveal><CTACountdown /></Reveal>
    </>
  )
}
