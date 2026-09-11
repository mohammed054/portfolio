import PlaceholderBox from './shared/PlaceholderBox'

const services = [
  { id: 'HOME-SERVICEPANEL-1', title: 'Graphic Design' },
  { id: 'HOME-SERVICEPANEL-2', title: 'Web Development' },
  { id: 'HOME-SERVICEPANEL-3', title: 'Creative Video' },
]

function ServicesPanel() {
  return (
    <section className="py-[140px] bg-dark-bg">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="relative h-[400px] overflow-hidden group cursor-pointer">
              <PlaceholderBox
                id={service.id}
                type="[IMAGE]"
                width="100%"
                height="100%"
                label={`${service.title} — workspace photo`}
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-xl font-bold">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesPanel
