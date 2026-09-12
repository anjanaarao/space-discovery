import { useCallback, useEffect, useState } from 'react'
import SolarSystem from './components/SolarSystem'
import FactPopup from './components/FactPopup'
import SceneControls from './components/SceneControls'
import './App.css'

export default function App() {
  // `focus` drives the camera; `popup` drives the modal. They're separate because the
  // popup only opens once the camera has finished flying in.
  const [focus, setFocus] = useState(null)
  const [popup, setPopup] = useState(null)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(5)

  const select = useCallback((body) => {
    setPopup(null)
    setFocus(body)
  }, [])

  const dismiss = useCallback(() => {
    setPopup(null)
    setFocus(null)
  }, [])

  const handleArrive = useCallback((body) => {
    if (body) setPopup(body)
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dismiss])

  return (
    <div className="app">
      <SolarSystem
        focus={focus}
        onSelect={select}
        onDismiss={dismiss}
        onArrive={handleArrive}
        paused={paused}
        speed={speed}
      />

      <header className="app__header">
        <h1>Solar System</h1>
        <p>Drag to orbit · scroll to zoom · click a world for its story</p>
      </header>

      <SceneControls
        paused={paused}
        onTogglePause={() => setPaused((p) => !p)}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <FactPopup data={popup} onClose={dismiss} />

      <footer className="app__credit">
        Textures:{' '}
        <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">
          Solar System Scope
        </a>{' '}
        (CC BY 4.0)
      </footer>
    </div>
  )
}
