import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * رشّة زعتر وسمسم — دفعة جزيئات instanced تنهمر فوق الطبقة العليا
 * عند تبديل الحشوة (burstId يتغير). تنطفئ وتختفي خلال ~1.5 ثانية.
 */
const COUNT = 110

export default function ZaatarSprinkle({ burstId = 0, originY = 1.4 }) {
  const zaatarRef = useRef(null)
  const sesameRef = useRef(null)
  const state = useRef({ particles: [], active: false, t: 0 })
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const zaatarMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#46562f', roughness: 0.9, transparent: true }),
    []
  )
  const sesameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ecdfb6', roughness: 0.55, transparent: true }),
    []
  )

  useEffect(() => {
    if (!burstId) return
    const parts = []
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * 1.5
      parts.push({
        pos: new THREE.Vector3(Math.cos(a) * r, originY + Math.random() * 1.1, Math.sin(a) * r),
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.5, -(0.8 + Math.random() * 1.4), (Math.random() - 0.5) * 0.5),
        rot: new THREE.Euler(Math.random() * 3, Math.random() * 3, Math.random() * 3),
        spin: (Math.random() - 0.5) * 8,
        scale: 0.5 + Math.random(),
      })
    }
    state.current = { particles: parts, active: true, t: 0 }
  }, [burstId, originY])

  useFrame((_, delta) => {
    const s = state.current
    const zm = zaatarRef.current
    const sm = sesameRef.current
    if (!zm || !sm) return
    if (!s.active) {
      zm.count = 0
      sm.count = 0
      return
    }
    s.t += delta
    const life = 1.55
    const fade = THREE.MathUtils.clamp(1 - s.t / life, 0, 1)
    zaatarMat.opacity = fade
    sesameMat.opacity = fade
    if (fade <= 0) {
      s.active = false
      return
    }
    const half = Math.floor(COUNT / 2)
    s.particles.forEach((p, i) => {
      p.vel.y -= 2.6 * delta // جاذبية
      p.pos.addScaledVector(p.vel, delta)
      p.rot.x += p.spin * delta
      p.rot.z += p.spin * 0.7 * delta
      dummy.position.copy(p.pos)
      dummy.rotation.copy(p.rot)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      const target = i < half ? zm : sm
      target.setMatrixAt(i < half ? i : i - half, dummy.matrix)
    })
    zm.count = half
    sm.count = COUNT - half
    zm.instanceMatrix.needsUpdate = true
    sm.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={zaatarRef} args={[null, null, COUNT]} material={zaatarMat} frustumCulled={false}>
        <tetrahedronGeometry args={[0.028]} />
      </instancedMesh>
      <instancedMesh ref={sesameRef} args={[null, null, COUNT]} material={sesameMat} frustumCulled={false}>
        <sphereGeometry args={[0.018, 6, 5]} />
      </instancedMesh>
    </group>
  )
}
