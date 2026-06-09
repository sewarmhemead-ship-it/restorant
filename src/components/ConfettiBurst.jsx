import { useEffect } from 'react'

const COLORS = ['#5C6B4A', '#B8956A', '#F5F0E6', '#7A8B62', '#9E4A3A']

/** Lightweight CSS confetti burst — no extra dependencies. */
export default function ConfettiBurst({ active, onComplete }) {
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => onComplete?.(), 2400)
    return () => clearTimeout(timer)
  }, [active, onComplete])

  if (!active) return null

  return (
    <div className="confetti-root pointer-events-none" aria-hidden>
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            '--i': i,
            '--rot': `${(i * 47) % 360}deg`,
            '--color': COLORS[i % COLORS.length],
            '--x': `${((i * 13) % 21) - 10}px`,
          }}
        />
      ))}
    </div>
  )
}
