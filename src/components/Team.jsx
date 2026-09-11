import { Play } from 'lucide-react'
import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

function Team() {
  return (
    <section className="py-[140px] bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading eyebrow="OUR TEAM" title="Meet Our Team" className="text-left mb-8" />
            <div className="flex items-center gap-6">
              <Button to="/about/">About Us</Button>
              <a href="/contact-us/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 border-2 border-secondary rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                  <Play size={16} className="ml-1" />
                </div>
                <span className="text-sm font-bold text-text-dark group-hover:text-secondary transition-colors">
                  Contact Us
                </span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PlaceholderBox
              id="ABOUT-TEAM-PHOTO-1"
              type="[IMAGE]"
              width="100%"
              height="250px"
              label="Saber Nasr — Project Manager"
            />
            <PlaceholderBox
              id="ABOUT-TEAM-PHOTO-2"
              type="[IMAGE]"
              width="100%"
              height="250px"
              label="Mohamed Maksoud — Graphic Designer"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team
