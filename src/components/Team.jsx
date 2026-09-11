import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

function Team() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading eyebrow="OUR TEAM" title="Meet Our Team" className="text-left mb-8" />
            <div className="flex items-center gap-6">
              <Button to="/about/">About Us</Button>
              <Link to="/contact-us/" className="flex items-center gap-3 group">
                <div className="w-[50px] h-[50px] border-2 border-secondary rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 text-secondary">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </div>
                <span className="text-[15px] font-semibold text-text-dark group-hover:text-secondary transition-colors font-[Poppins]">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="overflow-hidden group cursor-pointer">
              <PlaceholderBox
                id="ABOUT-TEAM-PHOTO-1"
                type="[IMAGE]"
                width="100%"
                height="280px"
                label="Saber Nasr — Project Manager"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="overflow-hidden group cursor-pointer">
              <PlaceholderBox
                id="ABOUT-TEAM-PHOTO-2"
                type="[IMAGE]"
                width="100%"
                height="280px"
                label="Mohamed Maksoud — Graphic Designer"
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team
