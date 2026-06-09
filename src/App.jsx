import { forwardRef, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from './lib/gsap'
import {
  DEFAULT_FILLING_ID,
  fillingOptions,
  getFillingById,
  layerBottom,
  layerFillingSalad,
} from './data/content'

const chapters = [
  {
    id: 'discover',
    number: '01',
    label: 'Discover',
    eyebrow: 'THE BAKERY',
    title: 'Der Levantinische Bio Stack',
    copy: 'Eine neue Art von Brot.',
  },
  {
    id: 'explore',
    number: '02',
    label: 'Explore',
    eyebrow: 'Exploded View',
    title: 'Drei Schichten. Ein ruhiger Moment.',
    copy: 'Manakish oben, frische Bio-Zutaten in der Mitte und eine handgemachte Basis.',
  },
  {
    id: 'create',
    number: '03',
    label: 'Create',
    eyebrow: 'Create your Stack.',
    title: 'Wähle die Manakish.',
    copy: 'Die frische Mitte bleibt. Der obere Manakish verändert den Charakter.',
  },
  {
    id: 'taste',
    number: '04',
    label: 'Taste',
    eyebrow: 'Taste',
    title: 'Tradition. Bio Qualität. Neu gedacht.',
    copy: 'Ein levantinisches Produkt, inszeniert mit Ruhe, Handwerk und frischen Bio-Zutaten.',
  },
]

export default function App() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [currentFilling, setCurrentFilling] = useState(DEFAULT_FILLING_ID)
  const [isSwapping, setIsSwapping] = useState(false)

  const sceneRef = useRef(null)
  const productRef = useRef(null)
  const topRef = useRef(null)
  const fillingRef = useRef(null)
  const bottomRef = useRef(null)
  const shadowRef = useRef(null)
  const copyRefs = useRef([])
  const labelRefs = useRef([])

  const activeFilling = useMemo(() => getFillingById(currentFilling), [currentFilling])

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = [
      sceneRef.current,
      productRef.current,
      topRef.current,
      fillingRef.current,
      bottomRef.current,
      shadowRef.current,
    ]
    if (nodes.some((node) => !node)) return

    const ctx = gsap.context(() => {
      gsap.set(copyRefs.current, { autoAlpha: 0, y: 24 })
      gsap.set(copyRefs.current[0], { autoAlpha: 1, y: 0 })
      gsap.set(labelRefs.current, { autoAlpha: 0, y: 12 })
      gsap.set(productRef.current, { y: 0, scale: 1, rotateX: 54 })
      gsap.set(topRef.current, { z: 58, y: -14 })
      gsap.set(fillingRef.current, { z: 14, y: 6 })
      gsap.set(bottomRef.current, { z: -56, y: 26 })

      if (prefersReduced) return

      const mm = gsap.matchMedia()

      mm.add(
        { isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' },
        (self) => {
          const mobile = self.conditions.isMobile
          const lift = mobile ? 96 : 158
          const depth = mobile ? 128 : 225
          const closedTop = mobile ? 34 : 58
          const closedBottom = mobile ? -42 : -56
          const closedTopY = mobile ? -12 : -14
          const closedBottomY = mobile ? 18 : 26
          const closedFillZ = mobile ? 10 : 14
          const closedFillY = mobile ? 4 : 6
          const explodeFillZ = mobile ? 38 : 72

          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: {
              trigger: '.story-scroll',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
              onUpdate: ({ progress }) => {
                const next = progress < 0.2 ? 0 : progress < 0.56 ? 1 : progress < 0.82 ? 2 : 3
                setActiveChapter(next)
              },
            },
          })

          tl.to(productRef.current, { scale: mobile ? 1.14 : 1.18, y: mobile ? -12 : -20, duration: 1 }, 0)
            .to(copyRefs.current[0], { autoAlpha: 0, y: -18, duration: 0.35 }, 0.72)
            .to(copyRefs.current[1], { autoAlpha: 1, y: 0, duration: 0.35 }, 0.86)
            .to(topRef.current, { z: depth, y: -lift, duration: 1.25 }, 0.95)
            .to(fillingRef.current, { z: explodeFillZ, y: closedFillY, duration: 1.25 }, 0.95)
            .to(bottomRef.current, { z: -depth * 0.72, y: lift * 0.72, duration: 1.25 }, 0.95)
            .to(shadowRef.current, { scale: 1.5, opacity: 0.19, duration: 1.1 }, 0.95)
            .to(labelRefs.current, { autoAlpha: 1, y: 0, stagger: 0.09, duration: 0.4 }, 1.25)
            .to(productRef.current, { y: mobile ? -36 : -56, duration: 1 }, 1.85)
            .to(labelRefs.current, { autoAlpha: 0, y: -10, stagger: 0.05, duration: 0.35 }, 2.05)
            .to(topRef.current, { z: closedTop, y: closedTopY, duration: 0.85 }, 2.35)
            .to(fillingRef.current, { z: closedFillZ, y: closedFillY, duration: 0.85 }, 2.35)
            .to(bottomRef.current, { z: closedBottom, y: closedBottomY, duration: 0.85 }, 2.35)
            .to(copyRefs.current[1], { autoAlpha: 0, y: -18, duration: 0.35 }, 2.45)
            .to(copyRefs.current[2], { autoAlpha: 1, y: 0, duration: 0.35 }, 2.6)
            .to(productRef.current, { scale: mobile ? 1.03 : 1.07, y: 0, duration: 0.8 }, 2.65)
            .to(copyRefs.current[2], { autoAlpha: 0, y: -18, duration: 0.35 }, 3.32)
            .to(copyRefs.current[3], { autoAlpha: 1, y: 0, duration: 0.35 }, 3.5)
            .to(topRef.current, { z: mobile ? 30 : 48, y: mobile ? -10 : -12, duration: 0.65 }, 3.48)
            .to(bottomRef.current, { z: mobile ? -16 : -24, y: mobile ? 11 : 16, duration: 0.65 }, 3.48)
            .to(productRef.current, { scale: mobile ? 0.88 : 0.92, y: mobile ? 24 : 34, duration: 0.9 }, 3.55)
            .to(shadowRef.current, { scale: 1.1, opacity: 0.36, duration: 0.7 }, 3.55)
        }
      )
    }, sceneRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const chooseFilling = useCallback((id) => {
    if (id === currentFilling) return
    setIsSwapping(true)
    window.setTimeout(() => {
      setCurrentFilling(id)
      window.setTimeout(() => setIsSwapping(false), 360)
    }, 210)
  }, [currentFilling])

  return (
    <main className="premium-experience">
      <nav className="chapter-progress" aria-label="Story progress">
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className={activeChapter === index ? 'is-active' : ''}
          >
            <span>{chapter.number}</span>
            <strong>{chapter.label}</strong>
          </a>
        ))}
      </nav>

      <section ref={sceneRef} className="cinema-scene" aria-label="The Bakery product experience">
        <div className="ambient-light" />
        <div className="product-halo" />

        <div ref={productRef} className="bio-stack" aria-label="Der Levantinische Bio Stack">
          <div ref={shadowRef} className="museum-shadow" />
          <ProductLayer
            ref={bottomRef}
            image={layerBottom.image}
            alt="Handgemachte Basis"
            variant="bottom"
          />
          <FreshCore ref={fillingRef} image={layerFillingSalad.image} />
          <ProductLayer
            ref={topRef}
            image={activeFilling.image}
            alt={`${activeFilling.name} Manakish`}
            variant="top"
            className={isSwapping ? 'is-swapping' : ''}
          />
        </div>

        <div className="chapter-copy">
          {chapters.map((chapter, index) => (
            <article
              key={chapter.id}
              ref={(node) => { copyRefs.current[index] = node }}
              className={`chapter-copy__item chapter-copy__item--${chapter.id}`}
            >
              <p>{chapter.eyebrow}</p>
              <h1>{chapter.title}</h1>
              <span>{chapter.copy}</span>
            </article>
          ))}
        </div>

        <div className="layer-labels" aria-hidden="true">
          <span ref={(node) => { labelRefs.current[0] = node }} className="layer-label layer-label--top">
            Bio Manakish
          </span>
          <span ref={(node) => { labelRefs.current[1] = node }} className="layer-label layer-label--middle">
            Frische Zutaten
          </span>
          <span ref={(node) => { labelRefs.current[2] = node }} className="layer-label layer-label--bottom">
            Handgemachte Basis
          </span>
        </div>

        <div className={`create-panel ${activeChapter === 2 ? 'is-visible' : ''}`}>
          <div className="filling-options" role="radiogroup" aria-label="Manakish wählen">
            {fillingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={currentFilling === option.id}
                className={currentFilling === option.id ? 'is-selected' : ''}
                onClick={() => chooseFilling(option.id)}
              >
                <img src={option.image} alt="" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          <p className="selection-confirmation">
            <span aria-hidden="true">✓</span>
            Deine Auswahl: <strong>{activeFilling.label}</strong>
          </p>
        </div>

        <a className={`taste-cta ${activeChapter === 3 ? 'is-visible' : ''}`} href="#taste">
          Jetzt probieren
        </a>
      </section>

      <div className="story-scroll" aria-hidden="true">
        {chapters.map((chapter) => (
          <div key={chapter.id} id={chapter.id} className="scroll-chapter" />
        ))}
      </div>
    </main>
  )
}

const ProductLayer = forwardRef(function ProductLayer({ image, alt, variant = 'bread', className = '' }, ref) {
  return (
    <div ref={ref} className={`product-layer product-layer--${variant} ${className}`}>
      <div className="bread-thickness" aria-hidden="true" />
      <img src={image} alt={alt} />
    </div>
  )
})

const FreshCore = forwardRef(function FreshCore({ image }, ref) {
  return (
    <div ref={ref} className="fresh-core" aria-label="Frische Bio-Zutaten">
      <img src={image} alt="Bio-Salatfüllung" />
    </div>
  )
})
