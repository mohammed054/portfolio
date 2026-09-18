import { PlayCircle } from 'lucide-react'
import Button from '../shared/Button.jsx'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

export default function TeamSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <EyebrowLabel>Our Team</EyebrowLabel>
          <SectionHeading className="mt-3">Meet Our Team</SectionHeading>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button to="/about">About Us</Button>
            <button className="flex items-center gap-2 text-sm font-semibold text-ink">
              <PlayCircle size={20} /> Contact Us
            </button>
          </div>
        </div>

        {/* ~300x250 each per spec 6.4 — Round 1 QA flagged these as too small */}
        <div className="grid grid-cols-2 gap-6">
          <PlaceholderBox
            id="ABOUT-TEAM-PHOTO-1"
            type="[IMAGE]"
            label="Team member — navy vest, outdoor garden setting"
            className="aspect-[6/5] min-h-[200px]"
          />
          <PlaceholderBox
            id="ABOUT-TEAM-PHOTO-2"
            type="[IMAGE]"
            label="Team member — navy blazer, glasses"
            className="aspect-[6/5] min-h-[200px]"
          />
        </div>
      </div>
    </section>
  )
}
