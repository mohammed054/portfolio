import { Routes, Route } from 'react-router-dom'
import PersistentLayout from './layout/PersistentLayout'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'

function App() {
  return (
    <Routes>
      <Route element={<PersistentLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about/" element={<About />} />
        <Route path="/our-portfolio/" element={<Portfolio />} />
        <Route path="/our-portfolio/:category/" element={<Portfolio />} />
        <Route path="/contact-us/" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App
