import { useState } from 'react'
import { MousePointer2, Share2, Target } from 'lucide-react'
import Reveal from './shared/Reveal'

const features = [
  { icon: MousePointer2, title: 'Creative Design', description: 'Get the best animation and interactive services for your business.' },
  { icon: Share2, title: 'Web Design and Development', description: "A brand's .com experience is its best opportunity to control its own message." },
  { icon: Target, title: 'Video Production', description: 'Visual effects in videos enhance the probability of sales conversion by a huge margin.' },
]

function AboutHero() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="section-padding bg-secondary text-white relative overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[31.5%_17.8%_50%] gap-8 items-center">
          <Reveal variant="fadeLeft" className="relative">
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <img
                src="/images/services/graphic-design.jpg"
                alt="Home-office desk setup"
                className="w-full h-[320px] object-cover"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden lg:block w-[210px] h-[250px]">
              <div className="relative w-full h-full">
                <img
                  src="/images/about/fiverr-profile.png"
                  alt="Fiverr profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-full p-[5px] bg-white shadow-[0px_3px_16px_0px_rgba(0,0,0,0.08)] transition-opacity duration-700"
                  style={{ opacity: hovered ? 0 : 1 }}
                />
                <img
                  src="/images/about/upwork-profile.png"
                  alt="Upwork profile"
                  className="absolute inset-0 w-full h-full object-cover rounded-full p-[5px] bg-white shadow-[0px_3px_16px_0px_rgba(0,0,0,0.08)] transition-opacity duration-700"
                  style={{ opacity: hovered ? 1 : 0 }}
                />
              </div>
            </div>
            <img
              src="/images/decorative/img-animation-5.png"
              alt="Floating dot grid"
              className="absolute -top-6 -left-6 hidden lg:block w-[130px] h-[130px] object-contain animate-float-slow"
            />
            <img
              src="/images/decorative/img-ellipse.png"
              alt=""
              className="absolute -bottom-16 -right-16 hidden lg:block w-[200px] h-[200px] object-contain animate-rotate-slow opacity-40"
              aria-hidden="true"
            />
          </Reveal>

          <div className="hidden lg:block" />

          <Reveal variant="fadeRight">
            <span className="eyebrow text-white">
              Get to Know Us
            </span>
            <h1 className="text-[clamp(32px,2rem+1.5vw,48px)] font-bold leading-[1.1] mb-6 text-white font-[Poppins]">
              We build the future.
            </h1>
            <p className="text-white/80 leading-[1.7] mb-10 text-[16px]">
              Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘
            </p>

            <div className="space-y-8">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-white">
                    <feature.icon size={40} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2 font-[Poppins]">{feature.title}</h3>
                    <p className="text-white/70 text-[0.833rem] leading-[1.7]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutHero
