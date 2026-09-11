import Hero from '../components/Hero'
import WhyChooseUs from '../components/WhyChooseUs'
import AboutPreview from '../components/AboutPreview'
import ServicesGallery from '../components/ServicesGallery'
import FunFacts from '../components/FunFacts'
import PortfolioGrid from '../components/PortfolioGrid'
import CreativeApproach from '../components/CreativeApproach'
import ServicesPanel from '../components/ServicesPanel'
import Platforms from '../components/Platforms'
import Testimonials from '../components/Testimonials'
import Team from '../components/Team'
import CountdownCTA from '../components/CountdownCTA'

function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <AboutPreview />
      <ServicesGallery />
      <FunFacts />
      <PortfolioGrid />
      <CreativeApproach />
      <ServicesPanel />
      <Platforms />
      <Testimonials />
      <Team />
      <CountdownCTA />
    </>
  )
}

export default Home
