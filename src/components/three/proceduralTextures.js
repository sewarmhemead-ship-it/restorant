import * as THREE from 'three'

/**
 * خامات مرسومة بالكود (canvas) — بلا أي أصول خارجية إضافية.
 * تُستدعى مرة واحدة (memoized في المكوّنات).
 */

function makeCanvas(size) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  return [c, c.getContext('2d')]
}

function asTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** ظل أرضي ناعم (radial gradient) */
export function createSoftShadowTexture() {
  const [c, ctx] = makeCanvas(256)
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 124)
  g.addColorStop(0, 'rgba(0,0,0,0.62)')
  g.addColorStop(0.55, 'rgba(0,0,0,0.28)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  return asTexture(c)
}

/** وجه شريحة الخيار: لبّ فاتح، بذور، وقشرة داكنة */
export function createCucumberTexture() {
  const [c, ctx] = makeCanvas(256)
  const cx = 128
  // اللب
  let g = ctx.createRadialGradient(cx, cx, 10, cx, cx, 120)
  g.addColorStop(0, '#e9f2cf')
  g.addColorStop(0.62, '#d7e8b4')
  g.addColorStop(0.86, '#b6d489')
  g.addColorStop(0.93, '#5d8a3a')
  g.addColorStop(1, '#3f6526')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cx, 124, 0, Math.PI * 2)
  ctx.fill()
  // خطوط شعاعية خفيفة
  ctx.strokeStyle = 'rgba(150,180,110,0.35)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * 18, cx + Math.sin(a) * 18)
    ctx.lineTo(cx + Math.cos(a) * 100, cx + Math.sin(a) * 100)
    ctx.stroke()
  }
  // بذور
  ctx.fillStyle = 'rgba(238,244,210,0.95)'
  ctx.strokeStyle = 'rgba(170,190,130,0.6)'
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3
    const r = 38 + (i % 3) * 14
    const x = cx + Math.cos(a) * r
    const y = cx + Math.sin(a) * r
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(a + Math.PI / 2)
    ctx.beginPath()
    ctx.ellipse(0, 0, 5, 9, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
  return asTexture(c)
}

/** ورقة جرجير بعروق — تُستعمل مع alphaTest */
export function createLeafTexture() {
  const [c, ctx] = makeCanvas(256)
  ctx.clearRect(0, 0, 256, 256)
  const cx = 128
  // جسم الورقة (شكل معيني منحني بفصوص خفيفة)
  ctx.fillStyle = '#4f7434'
  ctx.beginPath()
  ctx.moveTo(cx, 244)
  ctx.bezierCurveTo(70, 200, 38, 150, 58, 96)
  ctx.bezierCurveTo(76, 46, 108, 18, cx, 10)
  ctx.bezierCurveTo(148, 18, 180, 46, 198, 96)
  ctx.bezierCurveTo(218, 150, 186, 200, cx, 244)
  ctx.fill()
  // تظليل داخلي
  const g = ctx.createRadialGradient(cx, 110, 8, cx, 120, 130)
  g.addColorStop(0, 'rgba(190,220,140,0.5)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fill()
  // العرق الرئيسي والعروق الجانبية
  ctx.strokeStyle = 'rgba(225,240,190,0.8)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(cx, 238)
  ctx.lineTo(cx, 18)
  ctx.stroke()
  ctx.lineWidth = 2
  for (let i = 0; i < 5; i++) {
    const y = 60 + i * 36
    ctx.beginPath()
    ctx.moveTo(cx, y + 18)
    ctx.quadraticCurveTo(cx - 34, y + 4, cx - 52, y - 16)
    ctx.moveTo(cx, y + 18)
    ctx.quadraticCurveTo(cx + 34, y + 4, cx + 52, y - 16)
    ctx.stroke()
  }
  return asTexture(c)
}

/** قشرة بندورة: تدرّج أحمر لامع مع لمعة بسيطة */
export function createTomatoTexture() {
  const [c, ctx] = makeCanvas(128)
  const g = ctx.createLinearGradient(0, 0, 0, 128)
  g.addColorStop(0, '#e35038')
  g.addColorStop(0.5, '#cd3726')
  g.addColorStop(1, '#a32417')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return asTexture(c)
}

/** سطح جبنة عكاوي: أبيض كريمي بمسامات خفيفة */
export function createCheeseTexture() {
  const [c, ctx] = makeCanvas(128)
  ctx.fillStyle = '#f6f1e3'
  ctx.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 128
    const y = Math.random() * 128
    const r = 0.8 + Math.random() * 2.2
    ctx.fillStyle = `rgba(214,202,176,${0.25 + Math.random() * 0.3})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  return asTexture(c)
}
