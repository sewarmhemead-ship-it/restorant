import { useLayoutEffect } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Scroll-scrubbed exploded view. Runs once on mount — filling image swaps
 * must NOT re-trigger this effect (pass a stable refsRef from ExplodedStack).
 *
 * @param {React.MutableRefObject<object>} refsRef - { section, stage, top, filling, bottom, shadow }
 */
export function useExplodeScroll(refsRef) {
  useLayoutEffect(() => {
    const { section, stage, top, filling, bottom, shadow } = refsRef.current
    const nodes = [section, stage, top, filling, bottom, shadow]
    if (nodes.some((r) => !r?.current)) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReduced) return

      const mm = gsap.matchMedia()
      mm.add(
        { isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' },
        (self) => {
          const k = self.conditions.isMobile ? 0.62 : 1

          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section.current,
              start: 'top top',
              end: '+=160%',
              scrub: 1,
              pin: stage.current,
              anticipatePin: 1,
            },
          })
            .to(top.current, { z: 240 * k, scale: 1 + 0.05 * k }, 0)
            .to(filling.current, { z: 70 * k }, 0)
            .to(bottom.current, { z: -150 * k, scale: 1 - 0.03 * k }, 0)
            .to(shadow.current, { scale: 1.55, opacity: 0.22 }, 0)
        }
      )
    }, section)

    return () => ctx.revert()
  }, [refsRef])
}
