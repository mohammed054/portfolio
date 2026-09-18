import { Outlet } from 'react-router-dom'
import Header from '../components/shared/Header.jsx'
import SidebarSocial from '../components/shared/SidebarSocial.jsx'
import ChatWidget from '../components/shared/ChatWidget.jsx'
import GoToTop from '../components/shared/GoToTop.jsx'
import Footer from '../components/shared/Footer.jsx'

export default function PersistentLayout() {
  return (
    <div className="relative min-h-screen bg-white">
      <Header />
      <SidebarSocial />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <GoToTop />
    </div>
  )
}
