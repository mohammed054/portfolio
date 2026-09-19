import Hero from '../components/home/Hero.jsx'
import WhyChooseUs from '../components/home/WhyChooseUs.jsx'
import AboutPreview from '../components/home/AboutPreview.jsx'
import ServicesGallery from '../components/home/ServicesGallery.jsx'
import FunFacts from '../components/home/FunFacts.jsx'
import PortfolioGrid from '../components/home/PortfolioGrid.jsx'
import Reveal from '../components/shared/Reveal.jsx'

export default function Home() {
  return (
    <>
      <Reveal><Hero /></Reveal>
      <Reveal><WhyChooseUs /></Reveal>
      <Reveal><AboutPreview /></Reveal>
      <Reveal><ServicesGallery /></Reveal>
      <Reveal><FunFacts /></Reveal>
      <Reveal><PortfolioGrid /></Reveal>
    </>
  )
}
