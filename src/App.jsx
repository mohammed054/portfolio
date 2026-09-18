import { Routes, Route } from 'react-router-dom'
import PersistentLayout from './layout/PersistentLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <Routes>
      {/* PersistentLayout wraps every page in the same header, sidebar,
          chat widget, go-to-top control and footer, so those never
          remount when navigating between routes — see spec Section 4. */}
      <Route element={<PersistentLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
