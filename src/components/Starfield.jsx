import { Suspense, useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const SKY_RADIUS = 700

/** Milky Way skybox — an inside-out sphere, so the scene never sits on flat black. */
function Skybox() {
  const map = useTexture('/textures/2k_stars_milky_way.jpg')
  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace
  }, [map])
  return (
    <mesh raycast={() => null}>
      <sphereGeometry args={[SKY_RADIUS, 32, 32]} />
      <meshBasicMaterial map={map} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  )
}

/** A nearer particle layer so the sky has parallax when you orbit. */
function Particles({ count = 1200 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // uniform-ish points on a shell between 180 and 420 units out
      const r = 180 + Math.random() * 240
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi)
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <points geometry={geometry} frustumCulled={false} raycast={() => null}>
      <pointsMaterial size={1.1} sizeAttenuation color="#cfe0ff" transparent opacity={0.8} depthWrite={false} />
    </points>
  )
}

export default function Starfield() {
  return (
    <>
      <Suspense fallback={null}>
        <Skybox />
      </Suspense>
      <Particles />
    </>
  )
}
