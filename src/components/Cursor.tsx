import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import './Cursor.css'

/** Кастомный курсор: точка + кольцо, которое реагирует на интерактивные элементы */
export function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [state, setState] = useState<{ hover: boolean; label: string }>({ hover: false, label: '' })
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 })

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button, input, [data-cursor]')
      const label = target?.dataset.cursorLabel ?? ''
      setState((s) => (s.hover === !!target && s.label === label ? s : { hover: !!target, label }))
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y, opacity: visible ? 1 : 0 }} />
      <motion.div
        className={`cursor-ring ${state.hover ? 'is-hover' : ''} ${state.label ? 'has-label' : ''}`}
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
      >
        <span>{state.label}</span>
      </motion.div>
    </>
  )
}
