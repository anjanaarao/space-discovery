import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 48, 118)
export const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0)

/** Shared with OrbitControls' minDistance — the focus standoff must clear it, or
 *  the controls clamp the camera back out and the transition never settles. */
export const MIN_DISTANCE = 5

/** Give up easing and just open the popup after this long. */
const TRANSITION_TIMEOUT = 2.5

const UP = new THREE.Vector3(0, 1, 0)
/** How far to swing the focus camera off the Sun-body axis, in radians (~126°). */
const VIEW_SWING = 2.2

/**
 * Drives the camera on top of OrbitControls.
 *
 * While transitioning it eases position + target toward the focused body. Once it
 * arrives it hands control back to the user, and from then on only translates the
 * camera by however far the (still orbiting) body moved — so you can keep rotating
 * and zooming while staying locked on.
 */
export default function CameraRig({ focus, bodies, controls, onArrive }) {
  const { camera } = useThree()
  const transitioning = useRef(false)
  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const scratch = useRef(new THREE.Vector3())
  const lift = useRef(new THREE.Vector3())
  const elapsed = useRef(0)

  useEffect(() => {
    transitioning.current = true
    elapsed.current = 0
  }, [focus])

  useFrame((_, delta) => {
    const orbit = controls.current
    if (!orbit) return

    const body = focus ? bodies.current.get(focus.name) : null

    if (body) {
      body.getWorldPosition(desiredTarget.current)
      // Stand off from the body, swung round from the straight-out-from-the-Sun
      // direction so the Sun doesn't sit directly behind the planet (which would
      // both blow out the frame and leave us staring at the planet's night side),
      // and lifted a little above the ecliptic so the orbit line stays readable.
      const offset = scratch.current.copy(desiredTarget.current)
      if (offset.lengthSq() < 1e-6) offset.set(0, 0, 1)
      offset
        .normalize()
        .applyAxisAngle(UP, VIEW_SWING)
        .multiplyScalar(Math.max(focus.radius * 5.5, MIN_DISTANCE + 1))
      desiredPosition.current
        .copy(desiredTarget.current)
        .add(offset)
        .add(lift.current.set(0, Math.max(focus.radius * 2.2, 1.6), 0))
    } else {
      desiredTarget.current.copy(DEFAULT_TARGET)
      desiredPosition.current.copy(DEFAULT_CAMERA_POSITION)
    }

    if (transitioning.current) {
      const step = Math.min(delta, 0.1)
      elapsed.current += step
      // Frame-rate independent exponential ease.
      const t = 1 - Math.pow(0.0015, step)
      camera.position.lerp(desiredPosition.current, t)
      orbit.target.lerp(desiredTarget.current, t)
      orbit.update()

      const close =
        camera.position.distanceTo(desiredPosition.current) < 0.6 &&
        orbit.target.distanceTo(desiredTarget.current) < 0.4
      if (close || elapsed.current > TRANSITION_TIMEOUT) {
        transitioning.current = false
        onArrive(focus)
      }
    } else if (body) {
      // Follow the moving body without fighting the user's orbiting.
      const drift = scratch.current.copy(desiredTarget.current).sub(orbit.target)
      camera.position.add(drift)
      orbit.target.copy(desiredTarget.current)
      orbit.update()
    }
  })

  return null
}
