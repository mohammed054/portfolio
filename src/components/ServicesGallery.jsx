import PlaceholderBox from './shared/PlaceholderBox'

const services = [
  { id: 'HOME-SERVICES-PANEL-1', number: '01.', title: 'Graphic Designs' },
  { id: 'HOME-SERVICES-PANEL-2', number: '02.', title: 'Web Development' },
  { id: 'HOME-SERVICES-PANEL-3', number: '03.', title: 'Creative Video' },
  { id: 'HOME-SERVICES-PANEL-4', number: '04.', title: 'SEO' },
]

function ServicesGallery() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div key={service.id} className="relative h-[550px] overflow-hidden group cursor-pointer">
            <PlaceholderBox
              id={service.id}
              type="[IMAGE]"
              width="100%"
              height="100%"
              label={`${service.title} — workspace photo`}
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]" />
            <div className="absolute bottom-10 left-8 text-white z-[2]">
              <span className="text-sm font-medium block mb-2 opacity-80">{service.number}</span>
              <h3 className="text-xl font-bold font-[Poppins]">{service.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServicesGallery
