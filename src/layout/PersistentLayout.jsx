import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import SidebarSocial from '../components/SidebarSocial'
import ChatWidget from '../components/ChatWidget'
import GoToTop from '../components/GoToTop'
import CursorDot from '../components/CursorDot'

function PersistentLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-[64px]">
        <Outlet />
      </main>
      <Footer />
      <SidebarSocial />
      <ChatWidget />
      <GoToTop />
      <CursorDot />
    </div>
  )
}

export default PersistentLayout
