import { ui } from '../data/content'

export default function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-anthraciteDeep/85 backdrop-blur border-b border-cream/10">
      <div className="flex items-center justify-between px-6 sm:px-12 py-4 max-w-6xl mx-auto">
        <span className="font-black tracking-tight text-crust text-sm sm:text-base">The Bakery</span>
        <nav className="hidden sm:flex items-center gap-6 text-xs text-cream/60">
          <a href="#konzept" className="hover:text-cream transition">{ui.nav.concept}</a>
          <a href="#vorschau-3d" className="hover:text-cream transition">3D</a>
          <a href="#konfigurator" className="hover:text-cream transition">{ui.nav.configurator}</a>
          <a href="#details" className="hover:text-cream transition">{ui.nav.preview}</a>
        </nav>
        <span className="text-[10px] sm:text-xs text-cream/40">{ui.conceptBadge}</span>
      </div>
    </header>
  )
}
