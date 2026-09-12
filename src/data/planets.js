import * as THREE from 'three'

/**
 * Single source of truth for the scene.
 *
 * Distances and radii are NOT to scale (Neptune would be ~2000x further out than
 * the Sun is wide), but they keep the real *ordering* and rough proportions so the
 * system still reads correctly.
 *
 * `orbitSpeed` is relative to Earth = 1, compressed with a square root so the outer
 * planets still visibly move — real ratios would leave Neptune frozen (0.006x).
 *
 * Adding a planet, dwarf planet or moon later = adding an entry here. Nothing in the
 * render logic knows any planet by name.
 */

export const SUN = {
  name: 'Sun',
  radius: 4,
  texture: '/textures/2k_sun.jpg',
  segments: 48,
  spinSpeed: 0.03,
  facts: [
    'Contains 99.86% of all the mass in the solar system.',
    'Surface temperature is about 5,500 °C; the core reaches 15 million °C.',
    'Fuses roughly 600 million tonnes of hydrogen into helium every second.',
    'Light takes 8 minutes 20 seconds to reach Earth.',
  ],
  blurb:
    'A G-type main-sequence star about 4.6 billion years old, and the gravitational anchor for everything else in this scene.',
}

export const PLANETS = [
  {
    name: 'Mercury',
    radius: 0.5,
    orbitRadius: 9,
    eccentricity: 0.206,
    inclination: 0.122,
    orbitSpeed: 2.04,
    spinSpeed: 0.08,
    axialTilt: 0.0006,
    texture: '/textures/2k_mercury.jpg',
    color: '#b9a99a',
    blurb: 'The smallest planet and the closest to the Sun — a cratered, airless world of extremes.',
    facts: [
      'A single day (sunrise to sunrise) lasts 176 Earth days.',
      'Surface swings from −180 °C at night to 430 °C in daylight.',
      'Has almost no atmosphere, so its craters never erode.',
      'Orbits the Sun once every 88 Earth days — the fastest planet.',
    ],
  },
  {
    name: 'Venus',
    radius: 0.75,
    orbitRadius: 13.5,
    eccentricity: 0.007,
    inclination: 0.059,
    orbitSpeed: 1.27,
    spinSpeed: -0.02, // retrograde
    axialTilt: 3.096,
    texture: '/textures/2k_venus_surface.jpg',
    color: '#d9b382',
    blurb: "Earth's twin in size only — a runaway greenhouse world hot enough to melt lead.",
    facts: [
      'Hottest planet in the solar system at about 465 °C, hotter than Mercury.',
      'Rotates backwards, so the Sun rises in the west.',
      'One Venusian day is longer than its year.',
      'Surface pressure is 92x Earth’s — like being 900 m underwater.',
    ],
  },
  {
    name: 'Earth',
    radius: 0.8,
    orbitRadius: 18.5,
    eccentricity: 0.017,
    inclination: 0,
    orbitSpeed: 1,
    spinSpeed: 0.25,
    axialTilt: 0.409,
    texture: '/textures/2k_earth_daymap.jpg',
    color: '#4f93d1',
    blurb: 'The only place in the universe currently known to host life.',
    facts: [
      '71% of the surface is covered in liquid water.',
      'The atmosphere is 78% nitrogen and 21% oxygen.',
      'Its magnetic field deflects the solar wind that stripped Mars bare.',
      'The Moon is slowly drifting away at about 3.8 cm per year.',
    ],
  },
  {
    name: 'Mars',
    radius: 0.6,
    orbitRadius: 25,
    eccentricity: 0.093,
    inclination: 0.032,
    orbitSpeed: 0.73,
    spinSpeed: 0.24,
    axialTilt: 0.44,
    texture: '/textures/2k_mars.jpg',
    color: '#c1552f',
    blurb: 'The rusty desert world, and the most-visited destination in planetary exploration.',
    facts: [
      'Home to Olympus Mons, a volcano nearly three times the height of Everest.',
      'Its red colour comes from iron oxide — literally rust — in the soil.',
      'A Martian day is 24 hours 37 minutes, remarkably close to Earth’s.',
      'Has two small potato-shaped moons, Phobos and Deimos.',
    ],
  },
  {
    name: 'Jupiter',
    radius: 2.2,
    orbitRadius: 38,
    eccentricity: 0.049,
    inclination: 0.023,
    orbitSpeed: 0.29,
    spinSpeed: 0.55,
    axialTilt: 0.055,
    texture: '/textures/2k_jupiter.jpg',
    color: '#d8ae7a',
    blurb: 'A gas giant so massive that every other planet could fit inside it with room to spare.',
    facts: [
      'The Great Red Spot is a storm that has raged for at least 190 years.',
      'Spins once every 9 hours 56 minutes — the fastest rotation of any planet.',
      'Has 95 confirmed moons, including the ocean world Europa.',
      'Its gravity shields the inner planets from many incoming comets.',
    ],
  },
  {
    name: 'Saturn',
    radius: 1.9,
    orbitRadius: 52,
    eccentricity: 0.057,
    inclination: 0.043,
    orbitSpeed: 0.18,
    spinSpeed: 0.5,
    axialTilt: 0.466,
    texture: '/textures/2k_saturn.jpg',
    color: '#e3c98f',
    ring: {
      texture: '/textures/2k_saturn_ring_alpha.png',
      innerRadius: 2.4,
      outerRadius: 4.2,
    },
    blurb: 'The ringed jewel — a gas giant light enough that it would float in water.',
    facts: [
      'Its rings are mostly water ice, and only about 10 metres thick in places.',
      'Average density is lower than water’s.',
      'Titan, its largest moon, has lakes of liquid methane.',
      'A year on Saturn lasts 29.4 Earth years.',
    ],
  },
  {
    name: 'Uranus',
    radius: 1.3,
    orbitRadius: 68,
    eccentricity: 0.046,
    inclination: 0.013,
    orbitSpeed: 0.11,
    spinSpeed: -0.3, // retrograde
    axialTilt: 1.706,
    texture: '/textures/2k_uranus.jpg',
    color: '#a5dbe0',
    blurb: 'An ice giant knocked onto its side, most likely by an ancient collision.',
    facts: [
      'Rotates on its side with a 98° axial tilt, so its poles face the Sun.',
      'Each pole gets 42 years of continuous daylight, then 42 years of night.',
      'Coldest planetary atmosphere recorded: −224 °C.',
      'First planet discovered with a telescope, by William Herschel in 1781.',
    ],
  },
  {
    name: 'Neptune',
    radius: 1.25,
    orbitRadius: 82,
    eccentricity: 0.011,
    inclination: 0.031,
    orbitSpeed: 0.08,
    spinSpeed: 0.32,
    axialTilt: 0.494,
    texture: '/textures/2k_neptune.jpg',
    color: '#3f63d6',
    blurb: 'The windiest world we know of, and the only planet found by mathematics before observation.',
    facts: [
      'Supersonic winds reach 2,100 km/h.',
      'Its position was predicted from orbital maths before anyone saw it, in 1846.',
      'Takes 165 Earth years to complete one orbit.',
      'Triton, its largest moon, orbits backwards and is geologically active.',
    ],
  },
]

/** Base angular rate. Earth completes one lap in roughly 25 seconds at 1x. */
export const BASE_ORBIT_RATE = 0.25

/**
 * Position on an ellipse with the Sun at one focus (not at the centre).
 * Mutates and returns `out`.
 */
export function orbitPosition(config, angle, out = new THREE.Vector3()) {
  const a = config.orbitRadius
  const e = config.eccentricity ?? 0
  const b = a * Math.sqrt(1 - e * e)
  const focusOffset = a * e
  return out.set(Math.cos(angle) * a - focusOffset, 0, Math.sin(angle) * b)
}

/** Points tracing a full orbit, for the faint guide line. */
export function orbitPath(config, segments = 160) {
  const points = []
  const v = new THREE.Vector3()
  for (let i = 0; i <= segments; i++) {
    orbitPosition(config, (i / segments) * Math.PI * 2, v)
    points.push(v.clone())
  }
  return points
}
