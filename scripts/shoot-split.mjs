// تحقق بصري للموقع المقسوم: صفحة العرض ← زر التخصيص ← استوديو الـ 3D
import { createRequire } from 'module'
const require = createRequire('C:/Users/sewar/Downloads/test/hamoud-accounting/backend/package.json')
const puppeteer = require('puppeteer')

const OUT = 'C:/Users/sewar/Desktop/pizza/scripts/shots'
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))

await page.goto('http://localhost:5180', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: `${OUT}/L1-hero.png` })

const scrollToEl = async (sel) => {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' }), sel)
  await new Promise((r) => setTimeout(r, 1400))
}

await scrollToEl('#idee')
await page.screenshot({ path: `${OUT}/L2-idee.png` })
await scrollToEl('#produkte')
await page.screenshot({ path: `${OUT}/L3-produkte.png` })
await scrollToEl('.big-cta')
await page.screenshot({ path: `${OUT}/L4-bigcta.png` })

// فتح الاستوديو من زر الدعوة الكبيرة
await page.click('.cta-gold--big')
await new Promise((r) => setTimeout(r, 3000))
await page.screenshot({ path: `${OUT}/S1-studio-discover.png` })

const total = await page.evaluate(() => document.body.scrollHeight - innerHeight)
await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), total * 0.45)
await new Promise((r) => setTimeout(r, 2600))
await page.screenshot({ path: `${OUT}/S2-studio-explore.png` })

// العودة لصفحة العرض
await page.evaluate((y) => scrollTo({ top: 0, behavior: 'instant' }), 0)
await new Promise((r) => setTimeout(r, 800))
await page.click('.studio-back')
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${OUT}/L5-back-home.png` })

console.log('SPLIT_SHOTS_DONE')
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO_PAGE_ERRORS')
await browser.close()
