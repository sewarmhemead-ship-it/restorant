// ─── Brand (DE market) ──────────────────────────────────────────────────────
export const brand = {
  company: 'The Bakery',
  product: 'Der Levantinische Bio-Stack',
  tagline: 'Premium-Syrische Manakish — wähle deine Lieblingsfüllung',
  kicker: 'Bio-Qualität trifft Levantinische Innovation',
}

export const ui = {
  conceptBadge: 'Konzeptpräsentation',
  nav: {
    concept: 'Die Idee',
    configurator: 'Konfigurator',
    preview: 'Details',
  },

  concept: {
    title: 'Die Idee',
    subtitle: 'Drei Schichten. Ein Produkt. Unendliche Kombinationen.',
    intro:
      'Syrische Manakish oben und unten — dazwischen deine Wahl: Muhammara, Lahm bi Ajeen oder Labneh. Stapelbar, bio, skalierbar.',
    steps: [
      { num: '01', title: 'Verstehen', text: 'Manakish ersetzt Brot — authentisch und bio-zertifiziert.' },
      { num: '02', title: 'Konfigurieren', text: 'Manakish-Varianten wählen — Muhammara, Lahm bi Ajeen, Labneh, Za\'atar.' },
      { num: '03', title: 'Erleben', text: 'Oben: Bio-Salat-Stack — scrollen und trennen.' },
    ],
    cta: 'Zur 3D-Ansicht →',
  },

  configurator: {
    title: 'Manakish-Konfigurator',
    subtitle: 'Wähle deine Manakish-Füllung — Muhammara, Lahm bi Ajeen, Labneh oder Za\'atar.',
    fillingLabel: 'Manakish-Füllung',
    previewLabel: 'Dein Manakish-Stack',
    summaryTitle: 'Deine Konfiguration',
    fixedLayer: 'Manakish (fest)',
    layersHeading: 'Schichten im Detail',
  },

  preview: {
    title: 'Bio-Stack — Salatfüllung',
    subtitle: 'Der klassische Bio-Stack mit frischer Salatfüllung.',
    explodedTitle: 'Explodierte Ansicht',
    explodedHint: 'Nach unten scrollen, um die Schichten zu trennen ↓',
  },

  bioMoment: {
    title: 'Dein Bio-Moment',
    body: 'Erlebe den Unterschied: Frische Bio-Zutaten, traditionell gebacken, direkt in deine Hand.',
    button: 'Jetzt probieren',
    success: 'Dein Bio-Stack wird frisch zubereitet …',
    successDone: 'Bestellung bestätigt — Guten Appetit!',
  },
  bioBadge: 'Bio-Zertifiziert',
  footer: 'Interne Konzeptpräsentation',
}

export const layerTop = {
  id: 'top',
  name: 'Manakish (Oberschicht)',
  desc: 'Manakish-Teig mit regionalem Za\'atar und nativem Olivenöl extra vergine.',
  placeholder: 'crust',
  image: '/assets/manakish-top.png',
}

export const layerBottom = {
  id: 'bottom',
  name: 'Manakish (Basis)',
  desc: 'Knusprige Basis für stabilen Stack bis zum letzten Biss.',
  placeholder: 'crust',
  image: '/assets/manakish-bottom.png',
}

/** Fixed middle layer for the top 3D showcase (original bio salad). */
export const layerFillingSalad = {
  id: 'filling',
  name: 'Bio-Salatfüllung',
  desc: 'Akkawi-Käse, Cherrytomaten, Gurke, Rucola und frisches Bio-Gemüse.',
  placeholder: 'filling',
  image: '/assets/filling.png',
}

export const DEFAULT_FILLING_ID = 'muhammara'

export const fillingOptions = [
  {
    id: 'muhammara',
    label: 'Muhammara',
    name: 'Muhammara',
    shortDesc: 'Paprika · Walnuss · Gewürze',
    desc: 'Würzige Bio-Muhammara mit gerösteten Walnüssen und nativem Olivenöl.',
    swatch: 'linear-gradient(135deg, #9E4A3A 0%, #C0392B 50%, #7A3B1E 100%)',
    placeholder: 'filling',
    image: '/assets/filling-muhammara.png',
  },
  {
    id: 'lahm',
    label: 'Lahm bi Ajeen',
    name: 'Lahm bi Ajeen',
    shortDesc: 'Hackfleisch · Tomate · Petersilie',
    desc: 'Traditionelles Lahm bi Ajeen mit Bio-Hackfleisch, Tomaten und frischer Petersilie.',
    swatch: 'linear-gradient(135deg, #6B4423 0%, #9E4A3A 45%, #5C6B4A 100%)',
    placeholder: 'filling',
    image: '/assets/filling-lahm.png',
  },
  {
    id: 'labneh',
    label: 'Labneh',
    name: 'Labneh',
    shortDesc: 'Labneh · Olivenöl · Sesam',
    desc: 'Cremige Bio-Labneh mit Olivenöl und Sesam — mild und elegant.',
    swatch: 'linear-gradient(135deg, #F5F0E6 0%, #E8E2D6 40%, #5C6B4A 100%)',
    placeholder: 'filling',
    image: '/assets/filling-labneh.png',
  },
  {
    id: 'zaatar',
    label: "Za'atar",
    name: "Za'atar",
    shortDesc: "Za'atar · Olivenöl · Sesam",
    desc: "Klassischer Bio-Za'atar mit nativem Olivenöl, Sesam und Sumach — herb und authentisch.",
    swatch: 'linear-gradient(135deg, #5C6B4A 0%, #78835f 50%, #3d4a32 100%)',
    placeholder: 'filling',
    image: '/assets/filling-zaatar.png',
  },
]

export function toFillingLayer(option) {
  return {
    id: 'filling',
    name: option.name,
    desc: option.desc,
    placeholder: option.placeholder,
    image: option.image,
  }
}

export function getFillingById(id) {
  return fillingOptions.find((o) => o.id === id) ?? fillingOptions[0]
}

export function buildLayers(fillingId = DEFAULT_FILLING_ID) {
  return [layerTop, toFillingLayer(getFillingById(fillingId)), layerBottom]
}

export const pillars = [
  {
    icon: '🌿',
    title: 'Bio-Qualität',
    text: 'Regionale Bio-Rohstoffe, ohne Konservierungsstoffe.',
  },
  {
    icon: '🥖',
    title: 'Levantinische Identität',
    text: 'Manakish als Produktheld — sofortige Differenzierung am Markt.',
  },
  {
    icon: '⚡',
    title: 'Skalierbare Innovation',
    text: 'Modulare Schichten — ideal für industrielle Produktionslinien.',
  },
]
