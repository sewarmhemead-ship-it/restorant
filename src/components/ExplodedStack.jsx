import { useRef } from 'react'
import Layer from './Layer'
import BioBadge from './BioBadge'
import { useExplodeScroll } from '../hooks/useExplodeScroll'
import { layerTop, layerBottom, layerFillingSalad, ui } from '../data/content'

/** Top 3D — always the original bio salad stack (scroll explode). */
export default function ExplodedStack() {
  const section = useRef(null)
  const stage = useRef(null)
  const top = useRef(null)
  const filling = useRef(null)
  const bottom = useRef(null)
  const shadow = useRef(null)

  const refsRef = useRef({ section, stage, top, filling, bottom, shadow })
  refsRef.current = { section, stage, top, filling, bottom, shadow }

  useExplodeScroll(refsRef)

  return (
    <section id="vorschau-3d" ref={section} className="relative scroll-mt-20">
      <div className="px-6 sm:px-12 pt-8 pb-2 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-black text-cream">{ui.preview.title}</h2>
        <p className="text-cream/60 text-sm mt-2">{ui.preview.subtitle}</p>
      </div>
      <div ref={stage} className="explode-stage">
        <div className="pointer-events-none absolute left-6 top-10 max-w-xs sm:left-12">
          <p className="text-crust font-bold tracking-wide">{ui.preview.explodedTitle}</p>
          <p className="text-cream/70 text-sm mt-2">{ui.preview.explodedHint}</p>
        </div>

        <BioBadge />

        <div className="explode-stack">
          <div ref={shadow} className="contact-shadow" />
          <Layer ref={bottom} data={layerBottom} />
          <Layer ref={filling} data={layerFillingSalad} />
          <Layer ref={top} data={layerTop} />
        </div>
      </div>
    </section>
  )
}
