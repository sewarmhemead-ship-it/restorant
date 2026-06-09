import { brand, ui, pillars } from '../data/content'

export default function ConceptSection() {
  return (
    <section id="konzept" className="scroll-mt-20 px-6 sm:px-12 py-24 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-olive font-bold text-sm uppercase tracking-widest mb-3">
          {brand.kicker}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-cream leading-tight">
          {brand.product}
        </h1>
        <p className="mt-4 text-lg text-cream/70 max-w-2xl mx-auto">{brand.tagline}</p>
      </div>

      <div className="rounded-3xl border border-cream/10 bg-cream/[0.03] p-8 sm:p-10 mb-16">
        <h2 className="text-2xl font-black text-cream mb-3">{ui.concept.title}</h2>
        <p className="text-crust font-semibold mb-4">{ui.concept.subtitle}</p>
        <p className="text-cream/75 leading-relaxed max-w-3xl">{ui.concept.intro}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3 mb-16">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-cream/10 bg-anthracite/40 p-6 text-center"
          >
            <div className="text-3xl mb-3">{p.icon}</div>
            <h3 className="font-bold text-cream mb-2">{p.title}</h3>
            <p className="text-cream/65 text-sm">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        {ui.concept.steps.map((step) => (
          <div
            key={step.num}
            className="relative rounded-2xl border border-olive/20 bg-olive/5 p-6"
          >
            <span className="text-olive/60 font-black text-3xl">{step.num}</span>
            <h3 className="font-bold text-cream mt-2 mb-1">{step.title}</h3>
            <p className="text-cream/65 text-sm">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="#vorschau-3d"
          className="inline-block rounded-full bg-crust text-anthraciteDeep font-bold px-8 py-3
                     hover:bg-crustDark transition"
        >
          {ui.concept.cta}
        </a>
      </div>
    </section>
  )
}
