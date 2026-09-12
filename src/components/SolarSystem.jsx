import { useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, OrbitControls } from '@react-three/drei'
import CameraRig, { DEFAULT_CAMERA_POSITION, MIN_DISTANCE } from './CameraRig'
import Planet from './Planet'
import Starfield from './Starfield'
import Sun from './Sun'
import { PLANETS, SUN } from '../data/planets'
import './SolarSystem.css'

/**
 * The whole 3D scene. Every body is rendered from the config in ../data/planets.js —
 * adding one is a config entry, not a change here.
 */
export default function SolarSystem({ focus, onSelect, onDismiss, onArrive, paused, speed }) {
  const controls = useRef(null)
  const bodies = useRef(new Map())

  const registerBody = useCallback((name, object) => {
    if (object) bodies.current.set(name, object)
    else bodies.current.delete(name)
  }, [])

  return (
    <Canvas
      className="solar-canvas"
      dpr={[1, 1.75]}
      camera={{
        position: DEFAULT_CAMERA_POSITION.toArray(),
        fov: 48,
        near: 0.1,
        far: 2000,
      }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={onDismiss}
    >
      <color attach="background" args={['#03050c']} />

      <ambientLight intensity={0.22} />
      <Starfield />

      <Sun
        paused={paused}
        speed={speed}
        onSelect={onSelect}
        registerBody={registerBody}
        isFocused={focus?.name === SUN.name}
      />

      {PLANETS.map((config) => (
        <Planet
          key={config.name}
          config={config}
          paused={paused}
          speed={speed}
          onSelect={onSelect}
          registerBody={registerBody}
          isFocused={focus?.name === config.name}
        />
      ))}

      <OrbitControls
        ref={controls}
        enablePan
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.7}
        panSpeed={0.6}
        minDistance={MIN_DISTANCE}
        maxDistance={320}
        maxPolarAngle={Math.PI - 0.08}
        minPolarAngle={0.08}
      />

      <CameraRig focus={focus} bodies={bodies} controls={controls} onArrive={onArrive} />

      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
