import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { BASE_ORBIT_RATE, orbitPath, orbitPosition } from '../data/planets'

const SEGMENTS = 32 // plenty at these screen sizes; 64 doubles triangles for no visible gain

/** Split out so the texture (and only the texture) suspends. */
function PlanetSurface({ config, highlighted }) {
  const map = useTexture(config.texture)

  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 4
  }, [map])

  return (
    <meshStandardMaterial
      map={map}
      roughness={0.9}
      metalness={0}
      emissive={highlighted ? new THREE.Color(config.color) : new THREE.Color('#000000')}
      emissiveIntensity={highlighted ? 0.25 : 0}
    />
  )
}

function Ring({ ring }) {
  const map = useTexture(ring.texture)

  // The ring texture is a 1px-tall gradient strip; remap UVs so it runs
  // inner -> outer edge instead of wrapping around the disc.
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 64)
    const pos = geo.attributes.position
    const uv = geo.attributes.uv
    const v = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i)
      const t = (v.length() - ring.innerRadius) / (ring.outerRadius - ring.innerRadius)
      uv.setXY(i, t, 0.5)
    }
    return geo
  }, [ring.innerRadius, ring.outerRadius])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <meshBasicMaterial map={map} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
  )
}

export default function Planet({ config, paused, speed, onSelect, registerBody, isFocused }) {
  const pivot = useRef(null)
  const spinner = useRef(null)
  const angle = useRef(Math.random() * Math.PI * 2) // stagger starting positions
  const [hovered, setHovered] = useState(false)

  const path = useMemo(() => orbitPath(config), [config])

  useEffect(() => {
    registerBody(config.name, pivot.current)
    return () => registerBody(config.name, null)
  }, [config.name, registerBody])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1) // don't fling planets after a tab switch
    if (!paused) {
      angle.current += config.orbitSpeed * BASE_ORBIT_RATE * speed * step
      orbitPosition(config, angle.current, pivot.current.position)
    }
    // Axial spin is independent of orbital motion, but still respects pause.
    if (!paused && spinner.current) {
      spinner.current.rotation.y += config.spinSpeed * speed * step
    }
  })

  const active = hovered || isFocused

  return (
    <group rotation={[config.inclination ?? 0, 0, 0]}>
      {/* raycast disabled so clicking an orbit line still counts as clicking empty space */}
      <Line
        points={path}
        color={config.color}
        transparent
        opacity={active ? 0.45 : 0.15}
        lineWidth={1}
        raycast={() => null}
      />

      <group ref={pivot}>
        <group rotation={[0, 0, config.axialTilt ?? 0]}>
          <mesh
            ref={spinner}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
            }}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(config)
            }}
          >
            <sphereGeometry args={[config.radius, SEGMENTS, SEGMENTS]} />
            {/* Texture suspends on its own so the orbit keeps running while it loads. */}
            <Suspense fallback={<meshStandardMaterial color={config.color} roughness={1} />}>
              <PlanetSurface config={config} highlighted={active} />
            </Suspense>
          </mesh>

          {config.ring && (
            <Suspense fallback={null}>
              <Ring ring={config.ring} />
            </Suspense>
          )}
        </group>

        {/* No distanceFactor: the label stays a constant, readable screen size
            whether the planet is a few pixels wide or filling the viewport. */}
        {active && (
          <Html
            position={[0, config.radius + 0.4, 0]}
            center
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="planet-label">{config.name}</div>
          </Html>
        )}
      </group>
    </group>
  )
}
