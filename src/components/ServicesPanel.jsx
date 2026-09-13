import Reveal from './shared/Reveal'

const services = [
  { id: 'HOME-SERVICEPANEL-1', title: 'Graphic Design', src: '/images/services/graphic-design-thumb.jpg' },
  { id: 'HOME-SERVICEPANEL-2', title: 'Web Development', src: '/images/services/web-development-thumb.jpg' },
  { id: 'HOME-SERVICEPANEL-3', title: 'Creative Video', src: '/images/services/creative-video-thumb.jpg' },
]

function ServicesPanel() {
  return (
    <section className="section-padding bg-dark-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.12}>
              <div className="img-hover-mask relative cursor-pointer" style={{ aspectRatio: '4/3' }}>
                <img
                  src={service.src}
                  alt={`${service.title} — workspace photo`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="mask" />
                <div className="absolute inset-0 bg-black/30 z-[4] pointer-events-none" />
                <div className="absolute bottom-8 left-8 text-white z-[5]">
                  <h4 className="text-xl font-bold" style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif" }}>{service.title}</h4>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesPanel
