// مصدر واحد لـ GSAP + ScrollTrigger (تسجيل الإضافة مرة واحدة)
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
