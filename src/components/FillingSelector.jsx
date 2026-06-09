import { fillingOptions } from '../data/content'

export default function FillingSelector({ value, onChange }) {
  return (
    <div
      className="flex flex-wrap justify-center gap-4 sm:gap-6"
      role="radiogroup"
      aria-label="Füllung wählen"
    >
      {fillingOptions.map((option) => {
        const selected = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            onClick={() => onChange(option.id)}
            className={`group flex flex-col items-center gap-2.5 transition-all
              ${selected ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
          >
            <span
              className={`relative block h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden
                border-2 shadow-lg transition-all
                ${selected
                  ? 'border-olive ring-2 ring-olive/50 ring-offset-2 ring-offset-anthraciteDeep'
                  : 'border-cream/15 group-hover:border-cream/35'
                }`}
            >
              <img
                src={option.image}
                alt=""
                className="h-full w-full object-cover bg-anthracite"
              />
              {selected && (
                <span className="absolute inset-0 flex items-center justify-center bg-olive/30">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-olive text-xs text-cream font-bold">✓</span>
                </span>
              )}
            </span>
            <span className={`text-xs font-bold tracking-wide ${selected ? 'text-cream' : 'text-cream/55'}`}>
              {option.label}
            </span>
            <span className="text-[10px] text-cream/40 max-w-[90px] text-center leading-tight hidden sm:block">
              {option.shortDesc}
            </span>
          </button>
        )
      })}
    </div>
  )
}
