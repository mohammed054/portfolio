import Reveal from './shared/Reveal'

const services = [
  { id: 'HOME-SERVICES-PANEL-1', number: '01.', title: 'Graphic Designs', src: '/images/services/graphic-design.jpg' },
  { id: 'HOME-SERVICES-PANEL-2', number: '02.', title: 'Web Development', src: '/images/services/web-development.jpg' },
  { id: 'HOME-SERVICES-PANEL-3', number: '03.', title: 'Creative Video', src: '/images/services/creative-video.jpg' },
  { id: 'HOME-SERVICES-PANEL-4', number: '04.', title: 'SEO', src: '/images/services/seo-thumb.jpg' },
]

function ServicesGallery() {
  return (
    <section className="w-full bg-dark-bg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.1} variant="fadeUp" className="h-full">
            <div className="img-hover-mask relative h-[560px] cursor-pointer">
              <img
                src={service.src}
                alt={`${service.title} — workspace photo`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="mask" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[4] pointer-events-none" />
              <div className="absolute bottom-10 left-8 text-white z-[5]">
                <span className="text-[15px] font-medium block mb-2 opacity-80" style={{ fontFamily: "'europa', sans-serif" }}>{service.number}</span>
                <h6 className="text-xl font-bold" style={{ fontFamily: "'sofia-pro', 'europa', sans-serif" }}>{service.title}</h6>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default ServicesGallery
