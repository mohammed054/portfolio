import { PlayCircle } from 'lucide-react'
import Button from '../shared/Button.jsx'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const team = [
  {
    id: 'ABOUT-TEAM-PHOTO-1',
    label: 'Saber Nasr — navy vest, outdoor garden setting',
  },
  {
    id: 'ABOUT-TEAM-PHOTO-2',
    label: 'Second team member — navy blazer, glasses, garden setting',
  },
]

export default function TeamSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <EyebrowLabel withDash>Our Team</EyebrowLabel>
          <SectionHeading className="mt-3">Meet Our Team</SectionHeading>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button to="/about">About Us</Button>
            <a href="#/contact" className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-accent transition-colors">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink">
                <PlayCircle size={16} />
              </span>
              Contact Us
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {team.map((member) => (
            <PlaceholderBox
              key={member.id}
              id={member.id}
              type="[IMAGE]"
              label={member.label}
              className="aspect-[6/5] min-h-[200px]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
