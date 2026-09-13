import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PersistentLayout from './layout/PersistentLayout'
import CursorDot from './components/CursorDot'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'

function PageTransition() {
  const location = useLocation()
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    setPhase('exiting')
    const t1 = setTimeout(() => setPhase('entering'), 100)
    const t2 = setTimeout(() => setPhase('idle'), 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [location.pathname])

  if (phase === 'idle') return null
  return <div className={`page-transition-overlay ${phase}`} />
}

function App() {
  return (
    <>
      <CursorDot />
      <PageTransition />
      <Routes>
        <Route element={<PersistentLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about/" element={<About />} />
          <Route path="/our-portfolio/" element={<Portfolio />} />
          <Route path="/our-portfolio/:category/" element={<Portfolio />} />
          <Route path="/contact-us/" element={<Contact />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
