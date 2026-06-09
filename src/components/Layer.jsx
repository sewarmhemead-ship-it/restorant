import { forwardRef } from 'react'

const Layer = forwardRef(function Layer({ data, swapFade = false }, ref) {
  return (
    <div ref={ref} className="explode-layer" data-layer={data.id}>
      <img
        key={data.image}
        src={data.image}
        alt={data.name}
        loading="eager"
        className={swapFade ? 'layer-img-swap' : undefined}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextSibling.style.display = 'block'
        }}
      />
      <div className={`ph ph-${data.placeholder}`} style={{ display: 'none' }} aria-hidden />
    </div>
  )
})

export default Layer
