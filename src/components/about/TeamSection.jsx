import { PlayCircle } from 'lucide-react'
import Button from '../shared/Button.jsx'
import EyebrowLabel from '../shared/EyebrowLabel.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import PlaceholderBox from '../shared/PlaceholderBox.jsx'

const team = [
  {
    id: 'ABOUT-TEAM-PHOTO-1',
    name: 'Saber Nasr',
    role: 'Project Manager',
    label: 'Saber Nasr — navy vest, outdoor garden setting',
  },
  {
    id: 'ABOUT-TEAM-PHOTO-2',
    name: 'Mohamd Maksoud',
    role: 'Graphic Designer',
    label: 'Mohamd Maksoud — graphic designer',
  },
]

export default function TeamSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <EyebrowLabel>Our Team</EyebrowLabel>
          <SectionHeading className="mt-3">Meet Our Team</SectionHeading>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button to="/about">About Us</Button>
            <Button to="/contact">Contact Us</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {team.map((member) => (
            <div key={member.id}>
              <PlaceholderBox
                id={member.id}
                type="[IMAGE]"
                label={member.label}
                className="aspect-[6/5] min-h-[200px]"
              />
              <p className="mt-3 font-bold text-ink">{member.name}</p>
              <p className="text-sm text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
