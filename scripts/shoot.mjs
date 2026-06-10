// لقطات تحقق للموقع — يستعمل puppeteer (و Chromium المنزّل) من مشروع حمود المجاور
import { createRequire } from 'module'
const require = createRequire('C:/Users/sewar/Downloads/test/hamoud-accounting/backend/package.json')
const puppeteer = require('puppeteer')

const OUT = 'C:/Users/sewar/Desktop/pizza/scripts/shots'
const URL = 'http://localhost:5180'

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2500)) // تحميل الخامات وأول إطارات

await page.screenshot({ path: `${OUT}/1-discover.png` })

// إجمالي مدى السكرول
const total = await page.evaluate(() => document.body.scrollHeight - innerHeight)

// منتصف Explore — انفصال الطبقات + تفكك المكونات (progress ≈ 0.45)
await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), total * 0.45)
await new Promise((r) => setTimeout(r, 2600)) // scrub 1.2 يلحق
await page.screenshot({ path: `${OUT}/2-explore-ingredients.png` })

// فصل Create — لوحة اختيار الحشوة
await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), total * 0.7)
await new Promise((r) => setTimeout(r, 2200))
await page.screenshot({ path: `${OUT}/3-create.png` })

// تبديل حشوة: كبس زر Za'atar ولقطة أثناء/بعد الرشّة
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('.filling-options button')]
  const target = btns.find((b) => b.textContent.includes('Za'))
  target?.click()
})
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: `${OUT}/4-swap-mid.png` })
await new Promise((r) => setTimeout(r, 1300))
await page.screenshot({ path: `${OUT}/5-swap-done.png` })

// Taste
await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), total * 0.95)
await new Promise((r) => setTimeout(r, 2200))
await page.screenshot({ path: `${OUT}/6-taste.png` })

console.log('SHOTS_DONE')
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO_PAGE_ERRORS')
await browser.close()
