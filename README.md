# Space Discovery — Interactive Solar System

An interactive 3D solar system built with React, React Three Fiber and drei.

Deployed Link: https://space-discovery-ten.vercel.app

```bash
npm install
npm run dev
```

## What's here

- The Sun at the centre with all 8 planets on separate elliptical orbits (each with a real eccentricity and inclination, so the paths aren't concentric circles).
- Textured spheres using CC BY 4.0 maps from [Solar System Scope](https://www.solarsystemscope.com/textures/), served from `public/textures/`.
- A Milky Way skybox plus a nearer particle layer, so orbiting gives the sky some parallax.
- `OrbitControls` with zoom clamped to 5–320 units — close enough to inspect a planet, not close enough to end up inside the Sun.
- Hover a body for a floating label; click it to fly the camera in and open the fact popup.
- Click empty space or press `Esc` to close the popup and return to the wide view.
- Independent axial spin per body, including Venus's and Uranus's retrograde rotation.
- Pause/resume and 1× / 5× / 20× speed controls.

## Structure

```
src/
  data/planets.js          # config array + orbit maths — the only file that knows about specific planets
  components/
    SolarSystem.jsx        # the <Canvas> and scene graph
    Planet.jsx             # one orbiting, spinning, textured body (+ optional ring)
    Sun.jsx                # emissive centre body, point light, sprite corona
    Starfield.jsx          # skybox + particles
    CameraRig.jsx          # focus/return camera animation on top of OrbitControls
    SceneControls.jsx      # pause + speed HUD
    FactPopup.jsx          # the fact modal (name, image, blurb, facts)
```

### Adding a body

Add an entry to `PLANETS` in [`src/data/planets.js`](src/data/planets.js) and drop its texture in `public/textures/`. Nothing in the render logic references a planet by name.

```js
{
  name: 'Ceres',
  radius: 0.3,
  orbitRadius: 31,
  eccentricity: 0.079,
  inclination: 0.184,
  orbitSpeed: 0.53,   // relative to Earth = 1
  spinSpeed: 0.5,
  axialTilt: 0.07,
  texture: '/textures/2k_ceres.jpg',
  color: '#9a938c',
  blurb: '…',
  facts: ['…'],
}
```

Optional `ring: { texture, innerRadius, outerRadius }` adds a ring disc (see Saturn).

## Scale and speed

Distances and radii are **not** to scale — a true-scale model would put Neptune ~4,500 px off-screen for a 1 px Earth. Relative ordering and rough proportions are preserved instead. Orbit speeds use the square root of the real period ratios so the outer planets still visibly move; at real ratios Neptune would crawl at 0.006× Earth's rate.

## Performance notes

- Spheres are 32×32 segments; the difference against 64×64 isn't visible at these sizes but the triangle count quadruples.
- Textures load through drei's `useTexture` inside per-body `<Suspense>` boundaries, so each planet renders in a flat fallback colour and swaps in its map when ready — one slow texture never blocks the scene.
- `dpr` is capped at 1.75 and `<AdaptiveDpr>` drops resolution while the camera is moving.
- Orbit lines, the skybox, star particles and Saturn's rings all have raycasting disabled — that keeps the per-frame raycast cheap and means clicking any of them correctly counts as clicking empty space.

## Attribution

Planet and star textures © [Solar System Scope](https://www.solarsystemscope.com/textures/), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution is rendered in the bottom-right of the app.
