<script setup lang="ts">
/**
 * The globe from the Parchment landing page, rising over the closing band.
 *
 * Ported rather than shared: the original is a hero element that fills the
 * viewport and answers to scroll, this one is a horizon cropped by the section
 * edge. The shaders, the tilt and the cloud layer are the same, so the two
 * pages read as one product.
 *
 * `.client` because three touches `window` at import time, and because ~600KB
 * of renderer has no business in the payload of a page whose first screen is
 * text. The fade on `ready` covers the gap: an un-textured sphere popping in is
 * worse than a beat of nothing.
 */
import * as THREE from 'three'

const emit = defineEmits<{ ready: [] }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let sphere: THREE.Mesh
let tiltGroup: THREE.Group | null = null
let earthMat: THREE.ShaderMaterial
let clouds: THREE.Mesh | null = null
let atmosphere: THREE.Mesh | null = null
let frameId: number | null = null
let sizeObserver: ResizeObserver | null = null
let viewObserver: IntersectionObserver | null = null

function play() {
  if (frameId === null) {
    lastFrameAt = 0
    frameId = requestAnimationFrame(animate)
  }
}

function pause() {
  if (frameId !== null) cancelAnimationFrame(frameId)
  frameId = null
}
let resizeScheduled = false

/**
 * Everything that has to be undone. The original attached mouse, touch and
 * scroll handlers to `window` and never removed them, which is invisible on a
 * page that only unmounts on navigation and a leak everywhere else.
 */
const teardown: Array<() => void> = []
function on<K extends keyof WindowEventMap>(
  target: Window | HTMLElement,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  target.addEventListener(type, handler as EventListener, options)
  teardown.push(() => target.removeEventListener(type, handler as EventListener, options))
}

let albedoLoaded = false
let firstFrameRendered = false
let readyEmitted = false
function maybeEmitReady() {
  if (readyEmitted || !albedoLoaded || !firstFrameRendered) return
  readyEmitted = true
  emit('ready')
}

/** Idle spin, in radians per second. Slow: it is scenery, not a loading state. */
const SPIN = 0.05

let isDragging = false
let lastX = 0
let lastY = 0
let rotVelY = 0

function init() {
  const canvas = canvasRef.value
  if (!canvas) return

  const parent = canvas.parentElement
  const width = parent?.clientWidth || canvas.clientWidth || window.innerWidth
  const height = parent?.clientHeight || canvas.clientHeight || Math.round(window.innerHeight * 0.6)

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 3.1)

  // Earth's axial tilt, so the spin axis is not dead vertical.
  tiltGroup = new THREE.Group()
  tiltGroup.rotation.z = THREE.MathUtils.degToRad(23.5)
  scene.add(tiltGroup)

  earthMat = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: null },
      glowIntensity: { value: 0.8 },
      glowPower: { value: 3.0 },
      shadowIntensity: { value: 0.5 },
      time: { value: 0.0 },
      edgeStart: { value: 0.1 },
      edgeEnd: { value: 0.9 },
      noiseAmount: { value: 1 },
      shadowColor: { value: new THREE.Color(0xf4dab2) },
      grainScale: { value: 900.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float glowIntensity;
      uniform float glowPower;
      uniform float shadowIntensity;
      uniform float edgeStart;
      uniform float edgeEnd;
      uniform float noiseAmount;
      uniform vec3 shadowColor;
      uniform float grainScale;
      varying vec2 vUv;
      varying vec3 vNormal;

      // Non-interpolated grain anchored to UVs, so the terminator has paper
      // tooth rather than a clean gradient.
      float hash21(vec2 p){
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      void main() {
        vec4 texColor = texture2D(map, vUv);

        float fresnel = clamp(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
        vec3 glow = vec3(0.8, 0.9, 1.0) * pow(fresnel, glowPower) * glowIntensity;

        float edge = smoothstep(edgeStart, edgeEnd, fresnel);
        float grain = (hash21(vUv * grainScale) - 0.5) * 2.0;
        float shadowFactor = edge * shadowIntensity * clamp(0.9 + noiseAmount * grain, 0.0, 2.0);
        vec3 shaded = mix(texColor.rgb, shadowColor, clamp(shadowFactor, 0.0, 1.0));

        gl_FragColor = vec4(shaded + glow, 1.0);
      }
    `,
  })

  sphere = new THREE.Mesh(new THREE.SphereGeometry(1.06, 192, 192), earthMat)
  sphere.rotation.y = -0.55
  tiltGroup.add(sphere)

  // Outer atmosphere, back-faced and additive so it reads as air rather than shell.
  atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.23, 64, 64),
    new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(1.5, 1.3, 1.4) },
        viewVector: { value: camera.position },
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 n = normalize(normalMatrix * normal);
          vec3 v = normalize(normalMatrix * viewVector);
          intensity = pow(0.7 - dot(n, v), 4.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor * intensity, intensity * 1.2);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  )
  atmosphere.renderOrder = 1
  tiltGroup.add(atmosphere)

  const loader = new THREE.TextureLoader()

  loader.load('/textures/earth_albedo.webp', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.generateMipmaps = true
    earthMat.uniforms.map!.value = tex
    earthMat.needsUpdate = true
    albedoLoaded = true
    maybeEmitReady()
  })

  loader.load('/textures/clouds.webp', (tex) => {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.flipY = false
    clouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.062, 160, 160),
      new THREE.MeshBasicMaterial({ alphaMap: tex, transparent: true, depthWrite: false, opacity: 0.98 }),
    )
    clouds.rotation.copy(sphere.rotation)
    tiltGroup!.add(clouds)
  })

  onResize()
  animate()
  attachEvents()
}

function onResize() {
  if (!renderer || !canvasRef.value || !camera) return
  const p = canvasRef.value.parentElement
  const w = p?.clientWidth || canvasRef.value.clientWidth || window.innerWidth
  const h = p?.clientHeight || canvasRef.value.clientHeight || Math.round(window.innerHeight * 0.6)
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

function scheduleResize() {
  if (resizeScheduled) return
  resizeScheduled = true
  requestAnimationFrame(() => {
    resizeScheduled = false
    onResize()
  })
}

let lastFrameAt = 0

function animate(now = 0) {
  frameId = requestAnimationFrame(animate)
  if (!renderer) return

  // Time-based rather than per-frame, so the spin is the same speed on a 60Hz
  // panel and a 144Hz one. Clamped because a backgrounded tab resumes with a
  // gap of seconds, which would otherwise snap the globe round.
  const dt = lastFrameAt ? Math.min((now - lastFrameAt) / 1000, 0.1) : 0
  lastFrameAt = now

  const delta = SPIN * dt + rotVelY
  sphere.rotation.y += delta
  rotVelY *= 0.96
  if (Math.abs(rotVelY) < 0.00002) rotVelY = 0

  // Clouds lead the surface slightly, which is what sells it as weather.
  if (clouds) clouds.rotation.y += delta * 1.1

  earthMat.uniforms.time!.value = now * 0.001
  renderer.render(scene, camera)

  if (!firstFrameRendered) {
    firstFrameRendered = true
    maybeEmitReady()
  }
}

function attachEvents() {
  const canvas = canvasRef.value!
  const sens = 0.004

  const start = (x: number, y: number) => {
    isDragging = true
    lastX = x
    lastY = y
  }
  const move = (x: number, y: number) => {
    if (!isDragging) return
    const dx = x - lastX
    const dy = y - lastY
    sphere.rotation.y += dx * sens
    sphere.rotation.x = THREE.MathUtils.clamp(sphere.rotation.x + dy * sens * 0.2, -0.6, 0.6)
    rotVelY = dx * sens * 0.2
    lastX = x
    lastY = y
  }
  const end = () => {
    isDragging = false
  }

  on(canvas, 'mousedown', (e) => start(e.clientX, e.clientY))
  on(window, 'mousemove', (e) => move(e.clientX, e.clientY))
  on(window, 'mouseup', end)

  on(
    canvas,
    'touchstart',
    (e) => {
      const t = e.touches[0]
      if (t) start(t.clientX, t.clientY)
    },
    { passive: true },
  )
  on(
    canvas,
    'touchmove',
    (e) => {
      const t = e.touches[0]
      if (!t) return
      // Only claim the gesture when it is predominantly horizontal, so a
      // vertical swipe still scrolls the page past the globe.
      if (Math.abs(t.clientX - lastX) > Math.abs(t.clientY - lastY) * 1.2) e.preventDefault()
      move(t.clientX, t.clientY)
    },
    { passive: false },
  )
  on(window, 'touchend', end)
}

onMounted(() => {
  const tryInit = () => {
    if (canvasRef.value) init()
    else requestAnimationFrame(tryInit)
  }
  requestAnimationFrame(tryInit)
  on(window, 'resize', scheduleResize)

  requestAnimationFrame(() => {
    const parent = canvasRef.value?.parentElement
    if (!parent) return
    sizeObserver = new ResizeObserver(scheduleResize)
    sizeObserver.observe(parent)

    /**
     * Stop rendering when the globe is off screen.
     *
     * This sits at the very bottom of a page about five screens tall, and
     * without it a lit, textured sphere is redrawn sixty times a second the
     * entire time somebody is reading the pricing table. Measured at 3266x3266
     * on a retina display — 10.7 megapixels a frame, continuously, for
     * something nobody can see.
     *
     * Purely a pause: nothing about how it looks changes, because when the
     * condition is false the globe is not on screen to look at.
     */
    viewObserver = new IntersectionObserver(([entry]) =>
      entry?.isIntersecting ? play() : pause(),
    )
    viewObserver.observe(parent)
  })
})

onBeforeUnmount(() => {
  pause()
  for (const off of teardown) off()
  teardown.length = 0
  sizeObserver?.disconnect()
  viewObserver?.disconnect()
  renderer?.dispose()
  renderer = null
})
</script>

<template>
  <canvas ref="canvasRef" class="h-full w-full cursor-grab active:cursor-grabbing" />
</template>
