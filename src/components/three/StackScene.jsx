import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../../lib/gsap'
import { fillingOptions, layerBottom, layerFillingSalad } from '../../data/content'
import { stackMotion, pointerState } from './stackMotion'
import { createSoftShadowTexture } from './proceduralTextures'
import StackLayer from './StackLayer'
import Ingredients from './Ingredients'
import ZaatarSprinkle from './ZaatarSprinkle'

const ALL_URLS = [
  layerBottom.image,
  layerFillingSalad.image,
  ...fillingOptions.map((o) => o.image),
]

// مواضع الطبقات وهي مغلقة + مدى انفصالها (وحدات مشهد)
const BASE = { bottom: 0, salad: 0.3, top: 0.58 }
const SPREAD = { bottom: -0.78, salad: 0.52, top: 1.5 }

function configure(tex) {
  const list = Array.isArray(tex) ? tex : [tex]
  list.forEach((t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
}

/** يطبّق stackMotion على المجموعة والكاميرا كل إطار — بلا re-render */
function MotionRig({ groupRef, topRef, saladRef, bottomRef, ingredientsRef, shadowRef }) {
  const { camera } = useThree()
  const smooth = useRef({ px: 0, py: 0 })

  useFrame(({ clock }) => {
    const m = stackMotion
    const t = clock.elapsedTime
    const s = smooth.current
    s.px = THREE.MathUtils.lerp(s.px, pointerState.x, 0.06)
    s.py = THREE.MathUtils.lerp(s.py, pointerState.y, 0.06)

    const group = groupRef.current
    if (group) {
      group.position.y = -0.55 + m.lift
      const breathe = 1 + Math.sin(t * 0.8) * 0.006
      group.scale.setScalar(m.scale * breathe)
      group.rotation.y = Math.sin(t * 0.16) * 0.07 + s.px * 0.12
      group.rotation.x = s.py * 0.05
      group.rotation.z = m.tilt
    }

    if (topRef.current) topRef.current.position.y = BASE.top + m.explode * SPREAD.top
    if (saladRef.current) {
      const salad = saladRef.current
      salad.position.y = BASE.salad + m.explode * SPREAD.salad
      // ذوبان حشوة السلطة عندما تتفكك لمكونات منفردة
      const fade = 1 - m.ingredients
      salad.scale.setScalar(Math.max(0.001, 1 - m.ingredients * 0.22))
      salad.traverse((child) => {
        if (child.isMesh) child.material.opacity = fade
      })
      salad.visible = fade > 0.02
    }
    if (bottomRef.current) bottomRef.current.position.y = BASE.bottom + m.explode * SPREAD.bottom
    if (ingredientsRef.current) {
      ingredientsRef.current.position.y = BASE.salad + m.explode * SPREAD.salad + 0.12
    }

    if (shadowRef.current) {
      const sc = 4.4 + m.explode * 1.5 + m.lift * 0.7
      shadowRef.current.scale.setScalar(sc)
      shadowRef.current.material.opacity = THREE.MathUtils.clamp(
        0.52 - m.explode * 0.16 - m.lift * 0.16,
        0.16,
        0.6
      )
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, s.px * 0.55, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.05 + m.lift * 0.22 - s.py * 0.35, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8.3 - m.zoom, 0.05)
    camera.lookAt(0, 0.42 + m.lift * 0.5, 0)
  })
  return null
}

function SceneContent({ fillingImage }) {
  const textures = useTexture(ALL_URLS, configure)
  const texByUrl = useMemo(
    () => Object.fromEntries(ALL_URLS.map((u, i) => [u, textures[i]])),
    [textures]
  )

  // الصورة المعروضة فعلياً (تتبدّل في منتصف أنيميشن السحب/الإدخال)
  const [displayedTop, setDisplayedTop] = useState(fillingImage)
  const [burstId, setBurstId] = useState(0)

  const groupRef = useRef(null)
  const topRef = useRef(null)
  const topSlideRef = useRef(null)
  const saladRef = useRef(null)
  const bottomRef = useRef(null)
  const ingredientsRef = useRef(null)
  const shadowRef = useRef(null)

  const shadowTexture = useMemo(createSoftShadowTexture, [])

  // تبديل المنقوشة العليا: انسحاب جانبي → استبدال → دخول بارتداد + رشّة زعتر.
  // الـ timeline محفوظ في ref ويُقتل فقط عند تبديل جديد أو unmount —
  // وليس عند إعادة التصيير منتصف الحركة (كان يترك الطبقة عالقة خارج مكانها).
  const swapTlRef = useRef(null)
  const displayedRef = useRef(fillingImage)
  useEffect(() => {
    if (displayedRef.current === fillingImage) return
    const slide = topSlideRef.current
    if (!slide) {
      displayedRef.current = fillingImage
      setDisplayedTop(fillingImage)
      return
    }
    swapTlRef.current?.kill()
    const tl = gsap.timeline()
    swapTlRef.current = tl
    tl.to(slide.position, { x: -3.1, duration: 0.3, ease: 'power2.in' })
      .to(slide.rotation, { z: 0.34, duration: 0.3, ease: 'power2.in' }, 0)
      .add(() => {
        displayedRef.current = fillingImage
        setDisplayedTop(fillingImage)
        setBurstId((b) => b + 1)
      })
      .set(slide.position, { x: 3.1 })
      .set(slide.rotation, { z: -0.3 })
      .to(slide.position, { x: 0, duration: 0.62, ease: 'back.out(1.35)' })
      .to(slide.rotation, { z: 0, duration: 0.62, ease: 'back.out(1.35)' }, '<')
  }, [fillingImage])
  useEffect(() => () => swapTlRef.current?.kill(), [])

  return (
    <>
      <ambientLight intensity={0.62} color="#fff2dd" />
      <directionalLight position={[3.5, 6, 4]} intensity={2.5} color="#ffe9c8" />
      <directionalLight position={[-4, 2.5, -2.5]} intensity={0.8} color="#9fb284" />
      <pointLight position={[0, 2.6, -4.6]} intensity={16} color="#d7b978" />

      <group ref={groupRef}>
        <StackLayer
          ref={bottomRef}
          texture={texByUrl[layerBottom.image]}
          width={4.3}
          thickness={0.27}
          slices={11}
          position={[0, BASE.bottom, 0]}
        />
        <StackLayer
          ref={saladRef}
          texture={texByUrl[layerFillingSalad.image]}
          width={3.55}
          thickness={0.3}
          slices={5}
          displacement={0.2}
          brightnessFloor={0.55}
          position={[0, BASE.salad, 0]}
          renderOrder={10}
        />
        <group ref={ingredientsRef} position={[0, BASE.salad + 0.12, 0]}>
          <Ingredients />
        </group>
        <group ref={topRef} position={[0, BASE.top, 0]}>
          <group ref={topSlideRef}>
            <StackLayer
              texture={texByUrl[displayedTop]}
              width={4.3}
              thickness={0.27}
              slices={11}
              renderOrder={20}
            />
          </group>
        </group>
        <ZaatarSprinkle burstId={burstId} originY={1.7} />
      </group>

      {/* ظل أرضي ناعم (بديل ContactShadows — يحترم قصّات الـ PNG ويظل رخيصاً) */}
      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.56, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} />
      </mesh>

      <Sparkles
        count={34}
        scale={[7.5, 4.2, 5]}
        size={1.7}
        speed={0.22}
        opacity={0.32}
        color="#d7b978"
        position={[0, 1.1, 0]}
        noise={0.6}
      />

      <MotionRig
        groupRef={groupRef}
        topRef={topRef}
        saladRef={saladRef}
        bottomRef={bottomRef}
        ingredientsRef={ingredientsRef}
        shadowRef={shadowRef}
      />
    </>
  )
}

export default function StackScene({ fillingImage }) {
  // بارالاكس الماوس — مستمع على النافذة لأن الـ canvas لا يستقبل أحداثاً (pointer-events: none)
  useEffect(() => {
    const onMove = (e) => {
      pointerState.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointerState.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="stack-canvas" aria-label="Der Levantinische Bio Stack — 3D">
      <Canvas
        camera={{ fov: 31, position: [0, 3.05, 8.3], near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent fillingImage={fillingImage} />
        </Suspense>
      </Canvas>
    </div>
  )
}
