import { ScrollController, ScrollHeight } from './core/ScrollController'
import { Overlay } from './components/Overlay'
import { useMouse } from './systems/useMouse'
import Experience from './experience/Experience'

function SystemRoot() {
  useMouse()
  return null
}

export default function App() {
  return (
    <>
      <SystemRoot />
      <ScrollController />
      <Experience />
      <Overlay />
      <ScrollHeight />
    </>
  )
}
