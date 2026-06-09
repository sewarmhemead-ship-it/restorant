import { ui } from '../data/content'

export default function BioBadge() {
  return (
    <div
      className="pointer-events-none absolute left-4 bottom-[18%] sm:left-10 sm:bottom-[22%] z-10"
      aria-label={ui.bioBadge}
    >
      <div className="bio-badge inline-flex items-center gap-2 rounded-full border border-olive/40
                      bg-anthraciteDeep/85 backdrop-blur px-3 py-2 shadow-lg shadow-olive/10">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-olive/20 text-sm" aria-hidden>
          🌿
        </span>
        <p className="text-[11px] font-bold uppercase tracking-wider text-oliveLight">
          {ui.bioBadge}
        </p>
      </div>
    </div>
  )
}
