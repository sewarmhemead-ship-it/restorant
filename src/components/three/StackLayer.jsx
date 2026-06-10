import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'

/**
 * طبقة منتج من صورة PNG شفافة، بحجم حقيقي عبر "sprite stacking":
 * نسخ متراصة من نفس الصورة على ارتفاعات صغيرة — الحواف المتراكبة تعطي
 * سماكة وبارالاكس حقيقيين من زوايا الكاميرا المائلة، والنسخة العليا تأخذ
 * bump/displacement لتفاصيل إضاءة وتضاريس فعلية. أرخص بكثير من نموذج مجسّم
 * وتقبل استبدالها بـ GLB لاحقاً دون تغيير الواجهة.
 */
const StackLayer = forwardRef(function StackLayer(
  {
    texture,
    width = 4.2,
    thickness = 0.26,
    slices = 8,
    displacement = 0.14,
    brightnessFloor = 0.48,
    edgeTint = '#b9854e',
    renderOrder = 0,
    ...groupProps
  },
  ref
) {
  const materials = useMemo(() => {
    const tint = new THREE.Color(edgeTint)
    const white = new THREE.Color('#ffffff')
    return Array.from({ length: slices }, (_, i) => {
      const t = i / Math.max(1, slices - 1) // 0 = أسفل، 1 = أعلى
      const shade = brightnessFloor + (1 - brightnessFloor) * Math.pow(t, 0.65)
      // الشرائح السفلية تميل لِلون "خبز مشوي" دافئ بدل الرمادي/الأبيض الباهت
      const color = white.clone().lerp(tint, Math.pow(1 - t, 0.8) * 0.85).multiplyScalar(shade)
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.32,
        roughness: 0.82,
        metalness: 0.02,
        color,
        side: THREE.DoubleSide,
      })
      if (i === slices - 1) {
        // الوجه العلوي: تضاريس حقيقية + تفاصيل إضاءة من نفس الصورة
        mat.bumpMap = texture
        mat.bumpScale = 0.32
        mat.displacementMap = texture
        mat.displacementScale = displacement
      }
      return mat
    })
  }, [texture, slices, brightnessFloor, displacement, edgeTint])

  const geometries = useMemo(() => {
    const simple = new THREE.PlaneGeometry(width, width, 1, 1)
    const detailed = new THREE.PlaneGeometry(width, width, 72, 72)
    return { simple, detailed }
  }, [width])

  return (
    <group ref={ref} {...groupProps}>
      {materials.map((mat, i) => (
        <mesh
          key={i}
          geometry={i === slices - 1 ? geometries.detailed : geometries.simple}
          material={mat}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, (i / Math.max(1, slices - 1)) * thickness, 0]}
          scale={1 - (slices - 1 - i) * 0.004}
          renderOrder={renderOrder + i}
        />
      ))}
    </group>
  )
})

export default StackLayer
