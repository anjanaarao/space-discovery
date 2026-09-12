import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SUN } from '../data/planets'

function SunSurface() {
  const map = useTexture(SUN.texture)
  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
  }, [map])
  // Basic (unlit) material: the Sun is the light source, not a lit object.
  return <meshBasicMaterial map={map} toneMapped={false} />
}

/**
 * Camera-facing additive glow. A sprite with a radial-gradient texture reads as a
 * corona from every angle; scaled transparent spheres just look like hard discs.
 */
function Corona() {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0.0, 'rgba(255, 230, 170, 0.9)')
    gradient.addColorStop(0.22, 'rgba(255, 170, 60, 0.45)')
    gradient.addColorStop(0.5, 'rgba(255, 120, 24, 0.12)')
    gradient.addColorStop(1.0, 'rgba(255, 100, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <sprite scale={[SUN.radius * 7, SUN.radius * 7, 1]} raycast={() => null}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}

export default function Sun({ paused, speed, onSelect, registerBody, isFocused }) {
  const mesh = useRef(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    registerBody(SUN.name, mesh.current)
    return () => registerBody(SUN.name, null)
  }, [registerBody])

  useFrame((_, delta) => {
    if (!paused && mesh.current) {
      mesh.current.rotation.y += SUN.spinSpeed * speed * Math.min(delta, 0.1)
    }
  })

  const active = hovered || isFocused

  return (
    <group>
      {/* decay 0 keeps Neptune lit at 82 units without a physically absurd intensity */}
      <pointLight intensity={2.2} decay={0} distance={0} color="#fff4e0" />

      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(SUN)
        }}
      >
        <sphereGeometry args={[SUN.radius, SUN.segments, SUN.segments]} />
        <Suspense fallback={<meshBasicMaterial color="#ffb347" />}>
          <SunSurface />
        </Suspense>
      </mesh>

      <Corona />

      {active && (
        <Html position={[0, SUN.radius + 0.6, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div className="planet-label">{SUN.name}</div>
        </Html>
      )}
    </group>
  )
}
