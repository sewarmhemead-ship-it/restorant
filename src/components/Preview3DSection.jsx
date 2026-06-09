import ExplodedStack from './ExplodedStack'
import FillingSelector from './FillingSelector'
import { ui } from '../data/content'

export default function Preview3DSection({
  fillingLayer,
  displayLayers,
  activeFilling,
  currentFilling,
  onFillingChange,
}) {
  return (
    <section id="vorschau-3d" className="scroll-mt-20">
      <div className="px-6 sm:px-12 pt-16 pb-4 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-black text-cream">{ui.preview.title}</h2>
        <p className="text-cream/65 text-sm mt-3 max-w-xl mx-auto">{ui.preview.subtitle}</p>
      </div>

      <ExplodedStack fillingLayer={fillingLayer} />

      {/* Interactive configurator menu — directly under 3D stack */}
      <div className="px-6 sm:px-12 py-10 max-w-3xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-cream/40 mb-6">
          {ui.preview.selectorLabel}
        </p>
        <FillingSelector value={currentFilling} onChange={onFillingChange} />
        <p className="mt-6 text-center text-sm text-cream/60 max-w-md mx-auto">
          <span className="text-cream/40">{ui.preview.configLabel}: </span>
          <span className="font-semibold text-oliveLight">{activeFilling.name}</span>
        </p>
        <p className="mt-2 text-center text-xs text-cream/45 max-w-sm mx-auto">
          {activeFilling.desc}
        </p>
      </div>

      <div className="px-6 sm:px-12 py-16 max-w-5xl mx-auto border-t border-cream/10">
        <h3 className="text-xl font-black text-cream mb-8 text-center">
          {ui.preview.layersHeading}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {displayLayers.map((l) => (
            <div
              key={l.id}
              className={`rounded-2xl border p-6 transition-colors
                ${l.id === 'filling'
                  ? 'border-olive/40 bg-olive/5'
                  : 'border-cream/10 bg-cream/[0.03]'
                }`}
            >
              <img
                src={l.image}
                alt={l.name}
                className="h-16 w-16 rounded-full object-cover mx-auto mb-4 bg-transparent"
              />
              <h4 className="font-bold text-crust mb-2 text-center">{l.name}</h4>
              <p className="text-cream/70 text-sm leading-relaxed text-center">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
