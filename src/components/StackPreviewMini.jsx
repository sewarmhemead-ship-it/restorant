import { layerTop, layerBottom, ui } from '../data/content'
import Layer from './Layer'

export default function StackPreviewMini({ fillingLayer }) {
  return (
    <div className="stack-preview-mini" aria-label={ui.configurator.previewLabel}>
      <p className="text-xs font-semibold uppercase tracking-wider text-cream/50 mb-4 text-center">
        {ui.configurator.previewLabel}
      </p>
      <div className="stack-preview-stage">
        <div className="explode-stack explode-stack--mini">
          <div className="contact-shadow contact-shadow--mini" />
          <Layer data={layerBottom} />
          <Layer data={fillingLayer} swapFade />
          <Layer data={layerTop} />
        </div>
      </div>
    </div>
  )
}
