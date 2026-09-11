import SectionHeading from './shared/SectionHeading'
import PlaceholderBox from './shared/PlaceholderBox'
import Button from './shared/Button'

const skills = [
  { name: 'Graphic Design', percentage: 96 },
  { name: 'Web Development', percentage: 97 },
  { name: 'SEO', percentage: 88 },
  { name: 'Video Editor', percentage: 86 },
]

const floatingIcons = [
  { id: 'illustrator', size: 100, left: '6%', top: '21%' },
  { id: 'wordpress', size: 83, left: '12.13%', top: '60.3%' },
  { id: 'photoshop', size: 115, left: '59.7%', top: '59%' },
  { id: 'coding', size: 95, left: '58.32%', top: '7.6%' },
  { id: 'premiere-pro', size: 80, left: '81.44%', top: '36.3%' },
  { id: 'after-effects', size: 71, left: '28.37%', top: '87.6%' },
  { id: 'seo', size: 84, left: '50%', top: '50%' },
]

function Skills() {
  return (
    <section className="py-[140px] bg-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <SectionHeading eyebrow="corporate service" title="We develop & create digital future" className="text-left mb-12" />

            <div className="space-y-8 mb-10">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold text-text-dark">{skill.name}</span>
                    <span className="text-text-muted">{skill.percentage}%</span>
                  </div>
                  <div className="h-[6px] bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button to="/contact-us/">Contact Us</Button>
          </div>

          <div className="relative hidden lg:block">
            {floatingIcons.map((icon) => (
              <PlaceholderBox
                key={icon.id}
                id={`ABOUT-SKILL-ICON-${icon.id}`}
                type="[ICON]"
                width={`${icon.size}px`}
                height={`${icon.size}px`}
                label={`${icon.id} icon (parallax)`}
                className="absolute rounded-full"
                style={{ left: icon.left, top: icon.top }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
