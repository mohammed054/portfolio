import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-light-bg">
      <div className="container-main w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-8 min-h-[calc(100vh-80px)]">
          <div className="relative z-10 py-20 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1
                className="text-[80px] max-lg:text-[43px] max-md:text-[36px] font-medium leading-[75px] max-lg:leading-[50px] max-md:leading-[42px] mb-6"
                style={{ fontFamily: "'sofia-pro', 'europa', sans-serif", color: '#1f242e', letterSpacing: '-2px' }}
              >
                Build Innovative Digital Projects
              </h1>
              <p
                className="text-[19px] max-md:text-[16px] leading-[30px] mb-8 max-w-[564px]"
                style={{ color: '#6b6e71', fontFamily: "'europa', sans-serif", fontWeight: 300 }}
              >
                Freelance Software Developer | Automation & Full-Stack Web | AI Workflows | Browser Extensions | Mobile Apps
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
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
                <div className="play-ring relative w-[50px] h-[50px] rounded-full flex items-center justify-center group-hover:bg-secondary transition-all duration-300 text-secondary">
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

          <div className="relative hidden max-lg:block">
            <img
              src="/images/about/home-drawing.png"
              alt="Saber Nasr — Professional portrait"
              className="max-w-[555px] w-full ml-auto object-contain relative z-[2]"
              width="555"
              height="1000"
            />

            <img
              src="/images/hero/Saber-Designer.jpg"
              alt="Saber Designer"
              className="absolute top-0 right-0 w-full h-full object-cover z-[1]"
            />

            <img
              src="/images/logos/main-logo.png"
              alt="Saber Nasr Logo"
              className="absolute top-0 left-0 w-full h-full object-contain z-[3]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
