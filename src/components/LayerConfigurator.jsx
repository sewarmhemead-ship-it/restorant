import { layerTop, layerBottom, ui } from '../data/content'
import FillingSelector from './FillingSelector'
import StackPreviewMini from './StackPreviewMini'

/** Manakish variants — mini 3D preview updates on selection. */
export default function LayerConfigurator({
  currentFilling,
  onFillingChange,
  activeFilling,
  fillingLayer,
}) {
  return (
    <section
      id="konfigurator"
      className="scroll-mt-20 px-6 sm:px-12 py-20 border-y border-cream/10 bg-cream/[0.02]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-cream">{ui.configurator.title}</h2>
          <p className="text-cream/65 text-sm mt-3 max-w-lg mx-auto">
            {ui.configurator.subtitle}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-olive mb-6">
              {ui.configurator.fillingLabel}
            </p>
            <FillingSelector value={currentFilling} onChange={onFillingChange} />
            <p className="mt-8 text-cream/70 text-sm max-w-md mx-auto lg:mx-0">
              <span className="font-semibold text-oliveLight">{activeFilling.label}</span>
              {' — '}
              {activeFilling.desc}
            </p>

            <p className="text-xs font-bold uppercase tracking-wider text-cream/40 mt-10 mb-4">
              {ui.configurator.summaryTitle}
            </p>
            <div className="space-y-2 max-w-md mx-auto lg:mx-0">
              <SummaryRow label={layerTop.name} badge={ui.configurator.fixedLayer} image={layerTop.image} />
              <SummaryRow
                label={activeFilling.name}
                badge={activeFilling.label}
                image={activeFilling.image}
                highlight
              />
              <SummaryRow label={layerBottom.name} badge={ui.configurator.fixedLayer} image={layerBottom.image} />
            </div>
          </div>

          <StackPreviewMini fillingLayer={fillingLayer} />
        </div>
      </div>
    </section>
  )
}

function SummaryRow({ label, badge, image, highlight = false }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3
        ${highlight ? 'border-olive/40 bg-olive/10' : 'border-cream/10 bg-anthracite/30'}`}
    >
      <img src={image} alt="" className="h-10 w-10 rounded-full object-cover bg-transparent shrink-0" />
      <p className="text-cream text-sm font-medium flex-1 truncate">{label}</p>
      <span className="text-[10px] uppercase tracking-wider text-cream/40 shrink-0">{badge}</span>
    </div>
  )
}
