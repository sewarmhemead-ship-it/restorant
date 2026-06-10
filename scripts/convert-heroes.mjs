// تحويل صور الـ hero من PNG ثقيلة إلى WebP (عبر canvas في Chromium — بلا أدوات خارجية)
import { createRequire } from 'module'
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
const require = createRequire('C:/Users/sewar/Downloads/test/hamoud-accounting/backend/package.json')
const puppeteer = require('puppeteer')

const SRC = 'C:/Users/sewar/Downloads'
const OUT = 'C:/Users/sewar/Desktop/pizza/public/assets/photos'
const MAX_W = 1600
const QUALITY = 0.82

const MAP = [
  ['ChatGPT Image 10. Juni 2026, 18_40_11.png', 'hero-zaatar.webp'],
  ['ChatGPT Image 10. Juni 2026, 18_41_13.png', 'hero-zaatar-alt.webp'],
  ['ChatGPT Image 10. Juni 2026, 18_43_17.png', 'hero-muhammara.webp'],
  ['ChatGPT Image 10. Juni 2026, 18_44_20.png', 'hero-lahm.webp'],
  ['ChatGPT Image 10. Juni 2026, 18_47_31.png', 'hero-labneh.webp'],
]

mkdirSync(OUT, { recursive: true })
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()

for (const [src, out] of MAP) {
  const url = 'data:image/png;base64,' + readFileSync(`${SRC}/${src}`).toString('base64')
  const dataUrl = await page.evaluate(
    async (u, maxW, q) => {
      const img = new Image()
      img.src = u
      await img.decode()
      const scale = Math.min(1, maxW / img.naturalWidth)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.naturalWidth * scale)
      canvas.height = Math.round(img.naturalHeight * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/webp', q)
    },
    url, MAX_W, QUALITY
  )
  const buf = Buffer.from(dataUrl.split(',')[1], 'base64')
  writeFileSync(`${OUT}/${out}`, buf)
  console.log(`${out}: ${(buf.length / 1024).toFixed(0)} KB`)
}

await browser.close()
console.log('CONVERT_DONE')
