import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { brand, ui, fillingOptions, pillars } from '../data/content'

/**
 * صفحة العرض — القسم الأول من الموقع:
 * صور المنتجات الحقيقية + شرح الفكرة + دعوة لفتح استوديو الـ 3D.
 */
export default function LandingPage({ onOpenStudio }) {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReduced) return

      // كشف تدريجي للعناصر عند دخولها الشاشة
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 38 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%' },
          }
        )
      })

      // بارالاكس خفيف لصورة الـ hero
      gsap.to('.landing-hero__bg img', {
        yPercent: 14,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.landing-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // دخول افتتاحي لنص الـ hero
      gsap.fromTo(
        '.landing-hero__copy > *',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.14, ease: 'power3.out', delay: 0.2 }
      )
    }, rootRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <main ref={rootRef} className="landing">
      <header className="landing-header">
        <span className="landing-header__brand">{brand.company}</span>
        <nav>
          <a href="#idee">{ui.landing.navIdea}</a>
          <a href="#produkte">{ui.landing.navProducts}</a>
          <button type="button" className="cta-gold cta-gold--small" onClick={onOpenStudio}>
            {ui.landing.navStudio}
          </button>
        </nav>
      </header>

      {/* ─── Hero: صورة المنتج الحقيقية ─── */}
      <section className="landing-hero">
        <div className="landing-hero__bg" aria-hidden="true">
          <img src="/assets/photos/hero-zaatar-alt.webp" alt="" />
        </div>
        <div className="landing-hero__copy">
          <p className="kicker">{ui.landing.heroKicker}</p>
          <h1>{ui.landing.heroTitle}</h1>
          <p className="sub">{ui.landing.heroSub}</p>
          <div className="landing-hero__actions">
            <button type="button" className="cta-gold" onClick={onOpenStudio}>
              {ui.landing.ctaStudio}
            </button>
            <a className="cta-ghost" href="#idee">
              {ui.landing.ctaIdea} ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── الفكرة ─── */}
      <section id="idee" className="landing-section">
        <p className="kicker reveal">{ui.landing.ideaKicker}</p>
        <h2 className="reveal">{ui.concept.title}</h2>
        <p className="landing-section__sub reveal">{ui.concept.intro}</p>

        <div className="steps-grid">
          {ui.concept.steps.map((step) => (
            <article key={step.num} className="step-card reveal">
              <span className="step-card__num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <div className="pillars-row">
          {pillars.map((p) => (
            <article key={p.title} className="pillar-card reveal">
              <span aria-hidden="true">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── المنتجات: صور حقيقية لكل نكهة ─── */}
      <section id="produkte" className="landing-section landing-section--wide">
        <p className="kicker reveal">{ui.landing.productsKicker}</p>
        <h2 className="reveal">{ui.landing.productsTitle}</h2>
        <p className="landing-section__sub reveal">{ui.landing.productsSub}</p>

        <div className="product-grid">
          {fillingOptions.map((option) => (
            <article key={option.id} className="product-card reveal">
              <div className="product-card__media">
                <img src={option.hero} alt={`${option.name} Stack`} loading="lazy" />
              </div>
              <div className="product-card__body">
                <h3>{option.name}</h3>
                <p className="product-card__tags">{option.shortDesc}</p>
                <p className="product-card__desc">{option.desc}</p>
                <button type="button" className="product-card__link" onClick={onOpenStudio}>
                  {ui.landing.productCta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── دعوة كبيرة: افتح الاستوديو ─── */}
      <section className="big-cta">
        <div className="big-cta__bg" aria-hidden="true">
          <img src="/assets/photos/hero-muhammara.webp" alt="" loading="lazy" />
        </div>
        <div className="big-cta__copy reveal">
          <p className="kicker">{ui.landing.bigCtaKicker}</p>
          <h2>{ui.landing.bigCtaTitle}</h2>
          <p className="sub">{ui.landing.bigCtaText}</p>
          <button type="button" className="cta-gold cta-gold--big" onClick={onOpenStudio}>
            {ui.landing.bigCtaButton}
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <span>{brand.company}</span>
        <span>{ui.footer}</span>
      </footer>
    </main>
  )
}
