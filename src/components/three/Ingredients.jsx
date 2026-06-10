import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { stackMotion } from './stackMotion'
import {
  createCucumberTexture,
  createLeafTexture,
  createTomatoTexture,
  createCheeseTexture,
} from './proceduralTextures'

/**
 * سحابة مكونات السلطة — بندورة شيري، جبنة عكاوي، شرحات خيار، أوراق جرجير.
 * عند stackMotion.ingredients → 1 تنبثق المكونات من قلب الحشوة وتتوزع
 * في مدار عائم حول الستاك (كل قطعة بتأخير ومسار خاص)، ثم تعود وتندمج.
 * كل القطع primitives بخامات مرسومة بالكود — صفر أصول خارجية.
 */

const TWO_PI = Math.PI * 2

function buildItems() {
  const rng = mulberry32(20260610)
  const items = []
  const push = (type, count, opts) => {
    for (let i = 0; i < count; i++) {
      const a = rng() * TWO_PI
      const r = 0.25 + rng() * 0.95
      const base = new THREE.Vector3(Math.cos(a) * r, 0.05 + rng() * 0.12, Math.sin(a) * r)
      const outA = a + (rng() - 0.5) * 1.2
      const outR = 1.7 + rng() * 1.15
      const exploded = new THREE.Vector3(
        Math.cos(outA) * outR,
        0.35 + rng() * 1.25,
        Math.sin(outA) * outR * 0.82
      )
      items.push({
        type,
        base,
        exploded,
        delay: rng() * 0.45,
        spin: new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(1.6),
        phase: rng() * TWO_PI,
        scale: opts.scale * (0.82 + rng() * 0.36),
        rot: [rng() * TWO_PI, rng() * TWO_PI, rng() * TWO_PI],
      })
    }
  }
  push('tomato', 7, { scale: 1 })
  push('cheese', 7, { scale: 1 })
  push('cucumber', 6, { scale: 1 })
  push('leaf', 9, { scale: 1 })
  return items
}

/** PRNG حتمي — نفس التوزيع بكل تحميل (يمنع "نطّ" المشهد بين الزيارات) */
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const easeOutBack = (t) => {
  const c1 = 1.20158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function IngredientMesh({ item, assets }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const ing = stackMotion.ingredients
    // تأخير لكل قطعة → انبثاق متتابع (stagger)
    const raw = THREE.MathUtils.clamp((ing - item.delay) / (1 - item.delay), 0, 1)
    if (raw <= 0.001) {
      g.visible = false
      return
    }
    g.visible = true
    const k = easeOutBack(raw)
    const t = clock.elapsedTime

    g.position.lerpVectors(item.base, item.exploded, k)
    g.position.y += Math.sin(t * 1.1 + item.phase) * 0.05 * raw // طفو
    const s = item.scale * Math.min(1, 0.2 + k)
    g.scale.setScalar(Math.max(0.001, s))
    g.rotation.set(
      item.rot[0] + item.spin.x * raw * t * 0.22,
      item.rot[1] + item.spin.y * raw * t * 0.22,
      item.rot[2] + item.spin.z * raw * t * 0.22
    )
  })

  return (
    <group ref={ref} visible={false}>
      {item.type === 'tomato' && (
        <mesh geometry={assets.tomatoGeo} material={assets.tomatoMat} scale={[1, 0.88, 1]} />
      )}
      {item.type === 'cheese' && (
        <mesh geometry={assets.cheeseGeo} material={assets.cheeseMat} />
      )}
      {item.type === 'cucumber' && (
        <mesh geometry={assets.cucumberGeo} material={assets.cucumberMats} />
      )}
      {item.type === 'leaf' && (
        <mesh geometry={assets.leafGeo} material={assets.leafMat} />
      )}
    </group>
  )
}

export default function Ingredients(props) {
  const items = useMemo(buildItems, [])

  const assets = useMemo(() => {
    const tomatoTex = createTomatoTexture()
    const cucumberTex = createCucumberTexture()
    const leafTex = createLeafTexture()
    const cheeseTex = createCheeseTexture()

    const cucumberSide = new THREE.MeshStandardMaterial({ color: '#3d6526', roughness: 0.55 })
    const cucumberCap = new THREE.MeshStandardMaterial({
      map: cucumberTex,
      roughness: 0.42,
    })

    return {
      tomatoGeo: new THREE.SphereGeometry(0.155, 26, 20),
      tomatoMat: new THREE.MeshStandardMaterial({
        map: tomatoTex,
        roughness: 0.28,
        metalness: 0.05,
      }),
      cheeseGeo: new THREE.BoxGeometry(0.21, 0.13, 0.21),
      cheeseMat: new THREE.MeshStandardMaterial({ map: cheeseTex, roughness: 0.68 }),
      cucumberGeo: new THREE.CylinderGeometry(0.165, 0.165, 0.04, 26),
      cucumberMats: [cucumberSide, cucumberCap, cucumberCap],
      leafGeo: new THREE.PlaneGeometry(0.34, 0.5),
      leafMat: new THREE.MeshStandardMaterial({
        map: leafTex,
        transparent: true,
        alphaTest: 0.4,
        roughness: 0.6,
        side: THREE.DoubleSide,
      }),
    }
  }, [])

  return (
    <group {...props}>
      {items.map((item, i) => (
        <IngredientMesh key={i} item={item} assets={assets} />
      ))}
    </group>
  )
}
