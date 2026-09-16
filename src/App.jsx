import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PersistentLayout from './layout/PersistentLayout'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
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

function App() {
  return (
    <>
      <PageTransition />
      <ScrollToTop />
      <Suspense fallback={
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-light-bg">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route element={<PersistentLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about/" element={<About />} />
            <Route path="/our-portfolio/" element={<Portfolio />} />
            <Route path="/our-portfolio/:category/" element={<Portfolio />} />
            <Route path="/contact-us/" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
