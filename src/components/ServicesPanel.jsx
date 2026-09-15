import { useState } from 'react'
import Reveal from './shared/Reveal'

const services = [
  {
    id: 'HOME-SERVICEPANEL-1',
    title: 'Graphic Design',
    src: '/images/services/graphic-design-thumb.jpg',
    hoverSrc: '/images/services/graphic-design-hover.jpg',
  },
  {
    id: 'HOME-SERVICEPANEL-2',
    title: 'Web Development',
    src: '/images/services/web-development-thumb.jpg',
    hoverSrc: '/images/services/web-development-hover.jpg',
  },
  {
    id: 'HOME-SERVICEPANEL-3',
    title: 'Creative Video',
    src: '/images/services/creative-video-thumb.jpg',
    hoverSrc: '/images/services/creative-video-hover.jpg',
  },
]

function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Reveal delay={0.1}>
      <div
        className="relative cursor-pointer overflow-hidden group"
        style={{ aspectRatio: '4/3' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={service.src}
          alt={`${service.title} — workspace photo`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 0 : 1 }}
          loading="lazy"
        />
        <img
          src={service.hoverSrc}
          alt={`${service.title} — hover photo`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 z-[4] pointer-events-none transition-opacity duration-500 group-hover:bg-black/10" />
        <div className="absolute bottom-8 left-8 text-white z-[5]">
          <h4
            className="text-xl font-bold transition-transform duration-500 group-hover:translate-x-2"
            style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}
          >
            {service.title}
          </h4>
        </div>
      </div>
    </Reveal>
  )
}

function ServicesPanel() {
  return (
    <section className="section-padding bg-dark-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesPanel
