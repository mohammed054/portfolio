import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PersistentLayout from './layout/PersistentLayout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Contact from './pages/Contact'

function PageTransition() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ scaleX: 1, transformOrigin: 'right' }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ backgroundColor: '#FFBC7D' }}
      />
    </AnimatePresence>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function SchemeClass() {
  const { pathname } = useLocation()
  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('scheme_light', 'scheme_default')
    html.classList.add(pathname === '/' ? 'scheme_light' : 'scheme_default')
  }, [pathname])
  return null
}

function App() {
  return (
    <>
      <PageTransition />
      <ScrollToTop />
      <SchemeClass />
      <Suspense fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-light-bg">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route element={<PersistentLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about/" element={<About />} />
            <Route path="/projects/" element={<Projects />} />
            <Route path="/skills/" element={<Skills />} />
            <Route path="/contact-us/" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App