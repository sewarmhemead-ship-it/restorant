import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { brand, ui, fillingOptions } from '../data/content'

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

      // تشريح الستاك: الطبقات تنفصل بنعومة مع السكرول (scrub خفيف، بلا تثبيت)
      const anatomyTrigger = {
        trigger: '.anatomy',
        start: 'top 82%',
        end: 'center 42%',
        scrub: 0.7,
      }
      gsap.fromTo(
        '.anatomy__layer--top',
        { y: 30 },
        { y: -118, ease: 'none', scrollTrigger: anatomyTrigger }
      )
      gsap.fromTo(
        '.anatomy__layer--base',
        { y: -30 },
        { y: 118, ease: 'none', scrollTrigger: { ...anatomyTrigger } }
      )
      gsap.utils.toArray('.anatomy-note').forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: 28 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.anatomy', start: `top ${78 - i * 9}%` },
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

      {/* ─── الفكرة: تشريح الستاك — تُرى لا تُقرأ ─── */}
      <section id="idee" className="landing-section landing-section--anatomy">
        <p className="kicker reveal">{ui.landing.anatomy.kicker}</p>
        <h2 className="reveal">{ui.landing.anatomy.title}</h2>

        <div className="anatomy">
          <div className="anatomy__visual" aria-hidden="true">
            <div className="anatomy__layer anatomy__layer--top">
              <img src="/assets/filling-zaatar.png" alt="" loading="lazy" />
            </div>
            <div className="anatomy__layer anatomy__layer--mid">
              <img src="/assets/filling.png" alt="" loading="lazy" />
            </div>
            <div className="anatomy__layer anatomy__layer--base">
              <img src="/assets/manakish-bottom.png" alt="" loading="lazy" />
            </div>
          </div>

          <ol className="anatomy__notes">
            {ui.landing.anatomy.layers.map((layer) => (
              <li key={layer.num} className="anatomy-note">
                <span className="anatomy-note__num">{layer.num}</span>
                <div>
                  <h3>{layer.title}</h3>
                  <p>{layer.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="anatomy__statement reveal">{ui.landing.anatomy.statement}</p>
        <p className="anatomy__traits reveal">{ui.landing.anatomy.traits}</p>
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
