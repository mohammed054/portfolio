import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const slides = [
  {
    heading: 'Build Innovative Digital Projects',
    text: 'Saber is a digital agency consists of strategists, creative minds, technologists, designers, marketers, storytellers, and inventors. 🤘',
  },
  {
    heading: 'Creative Solutions for Your Brand',
    text: 'We craft unique digital experiences that elevate your brand and connect with your audience.',
  },
  {
    heading: 'Let\'s Build Something Amazing',
    text: 'From strategy to execution, we deliver results that drive growth and success for your business.',
  },
]

const heroDecor = [
  { type: 'dashed', className: 'absolute top-10 right-[20%] w-[140px] h-[130px] border border-dashed border-[#6b6e71]/20 z-[1]', strength: 20 },
  { type: 'circle-secondary', className: 'absolute top-0 right-[10%] w-[230px] h-[230px] border-2 border-secondary/30 rounded-full z-[1]', strength: 30 },
  { type: 'circle-primary', className: 'absolute -bottom-20 left-0 w-[250px] h-[250px] border-2 border-primary/30 rounded-full z-[1]', strength: 25 },
]

function ParallaxDecor({ decor, mouseX, mouseY }) {
  const x = useSpring(useTransform(mouseX, [0, 1], [-decor.strength, decor.strength]), { stiffness: 50, damping: 20 })
  const y = useSpring(useTransform(mouseY, [0, 1], [-decor.strength, decor.strength]), { stiffness: 50, damping: 20 })
  return <div className={decor.className} style={{ x, y }} aria-hidden="true" />
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' } }),
}

function Hero() {
  const [currentSlide] = useState(0)
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const handleMouse = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <section ref={heroRef} onMouseMove={handleMouse} className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: '#f9f9f9' }}>
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 min-h-[calc(100vh-80px)]">
          <div className="relative z-10 py-20 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[80px] max-lg:text-[43px] max-md:text-[36px] font-medium leading-[75px] max-lg:leading-[50px] max-md:leading-[42px] mb-6"
              style={{ fontFamily: "'sofia-pro', 'Poppins', sans-serif", color: '#1f242e', letterSpacing: '-2px' }}
            >
              {slides[currentSlide].heading}
            </motion.h1>
            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-[19px] max-md:text-[16px] leading-[30px] mb-8 max-w-[564px]"
              style={{ color: '#6b6e71', fontFamily: "'europa', sans-serif", fontWeight: 300 }}
            >
              {slides[currentSlide].text}
            </motion.p>
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-8 max-lg:justify-center"
            >
              <Link
                to="/about/"
                className="relative group"
                style={{ fontFamily: "'europa', sans-serif", color: '#1f242e', fontSize: '19px', fontWeight: 500, textDecoration: 'none' }}
              >
                Discover More →
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f242e] scale-x-100 group-hover:scale-x-0 transition-transform duration-300 origin-center" />
              </Link>
              <div className="watch-intro flex items-center gap-3 cursor-pointer group">
                <div className="play-ring relative w-[50px] h-[50px] border-2 border-secondary rounded-full flex items-center justify-center group-hover:bg-secondary transition-all duration-300 text-secondary">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
                <span className="text-[14px] font-medium tracking-[2px] uppercase" style={{ color: '#1f242e', fontFamily: "'europa', sans-serif" }}>
                  WATCH INTRO
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-lg:hidden"
          >
            <img
              src="/images/hero-saber.webp"
              alt="Saber Nasr — Professional portrait"
              className="max-w-[850px] w-full ml-auto object-contain relative z-[2]"
              width="555"
              height="1000"
            />

            {heroDecor.map((d) => (
              <ParallaxDecor key={d.type} decor={d} mouseX={mouseX} mouseY={mouseY} />
            ))}
            <div className="absolute top-[40%] left-[30%] z-[3]" aria-hidden="true">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="10" x2="40" y2="40" stroke="white" strokeWidth="2" opacity="0.6"/>
                <line x1="40" y1="10" x2="10" y2="40" stroke="white" strokeWidth="2" opacity="0.6"/>
              </svg>
            </div>
            <div className="absolute bottom-[10%] right-[5%] z-[3]" aria-hidden="true">
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                {[...Array(25)].map((_, i) => (
                  <circle key={i} cx={15 + (i % 5) * 30} cy={15 + Math.floor(i / 5) * 30} r="2" fill="white" opacity="0.5"/>
                ))}
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
