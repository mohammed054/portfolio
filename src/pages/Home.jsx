import Hero from '../components/home/Hero.jsx'
import WhyChooseUs from '../components/home/WhyChooseUs.jsx'
import AboutPreview from '../components/home/AboutPreview.jsx'
import ServicesGallery from '../components/home/ServicesGallery.jsx'
import FunFacts from '../components/home/FunFacts.jsx'
import PortfolioGrid from '../components/home/PortfolioGrid.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <AboutPreview />
      <ServicesGallery />
      <FunFacts />
      <PortfolioGrid />
    </>
  )
}
