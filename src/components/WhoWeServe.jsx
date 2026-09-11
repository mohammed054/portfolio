import { Heart, GraduationCap, Landmark, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'

const industries = [
  { icon: Heart, title: 'Healthcare', description: 'Innovative digital solutions that improve patient care and streamline healthcare operations for better outcomes.' },
  { icon: GraduationCap, title: 'Education', description: 'Transforming learning experiences through engaging and accessible educational technology platforms.' },
  { icon: Landmark, title: 'Finance', description: 'Secure and efficient fintech solutions that empower businesses and enhance customer financial experiences.' },
  { icon: ShoppingBag, title: 'Retail', description: 'Crafting seamless and engaging shopping experiences that boost sales and build lasting customer loyalty.' },
  { icon: UtensilsCrossed, title: 'Food & Beverage', description: 'Creating appetizing digital solutions that delight customers and drive growth for food and beverage brands.' },
]

function WhoWeServe() {
  return (
    <section className="section-padding bg-light-bg">
      <div className="container-main">
        <SectionHeading eyebrow="WHO WE SERVE" title="Industries We Specialize In" className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, i) => (
            <div key={i} className="card-bordered">
              <div className="flex justify-center mb-6">
                <div className="w-[70px] h-[70px] flex items-center justify-center text-secondary">
                  <industry.icon size={52} strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-dark font-[Poppins] mb-3">{industry.title}</h3>
              <p className="text-text-muted text-[15px] leading-[1.7]">{industry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhoWeServe
