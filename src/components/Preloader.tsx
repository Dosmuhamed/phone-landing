import { animate, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import './Preloader.css'

export function Preloader({ onDone }: { onDone: () => void }) {
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, '0')
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`
      },
      onComplete: () => window.setTimeout(onDone, 250),
    })
    return () => controls.stop()
  }, [onDone])

  return (
    <motion.div
      className="preloader"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="preloader__brand">
        {'AURA'.split('').map((l, i) => (
          <span key={i} style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
            {l}
          </span>
        ))}
      </div>
      <div className="preloader__bottom">
        <span>Загружаем свет</span>
        <span ref={countRef} className="preloader__count">
          000
        </span>
      </div>
      <div className="preloader__bar">
        <div ref={barRef} />
      </div>
    </motion.div>
  )
}
