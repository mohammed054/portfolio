import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import SectionHeading from './shared/SectionHeading'
import Button from './shared/Button'
import Reveal from './shared/Reveal'

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

function FloatingIcon({ icon, mouseX, mouseY }) {
  const x = useTransform(mouseX, [0, 1], [-15, 15])
  const y = useTransform(mouseY, [0, 1], [-15, 15])
  const springX = useSpring(x, { stiffness: 50, damping: 20 })
  const springY = useSpring(y, { stiffness: 50, damping: 20 })

  return (
    <motion.img
      key={icon.id}
      src={`/images/skills/${icon.id}.png`}
      alt={`${icon.id} icon`}
      className="absolute rounded-full"
      style={{
        left: icon.left,
        top: icon.top,
        width: icon.size,
        height: icon.size,
        x: springX,
        y: springY,
      }}
    />
  )
}

function Skills() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="section-padding bg-secondary text-white relative overflow-hidden"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal variant="fadeLeft">
            <SectionHeading eyebrow="corporate service" title="We develop & create digital future" className="text-left mb-12" />

            <div className="space-y-8 mb-10">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold text-white text-[0.833rem]">{skill.name}</span>
                    <span className="text-white/70 text-[0.833rem]">{skill.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button to="/contact-us/">Contact Us</Button>
          </Reveal>

          <div className="relative hidden lg:block min-h-[400px]">
            {floatingIcons.map((icon) => (
              <FloatingIcon key={icon.id} icon={icon} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
